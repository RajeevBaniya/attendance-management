import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useAuthContext } from "../hooks/useAuthContext";
import { createRealtimeSource } from "./realtimeClient";

type RealtimeEventType =
  | "attendance.marked"
  | "trainer.request.approved"
  | "batch.created"
  | "session.created"
  | "trainer.assigned"
  | "student.joined.batch";

type RealtimeEvent = {
  type: RealtimeEventType;
  payload: {
    institutionId?: string;
    trainerId?: string;
    studentId?: string;
    requesterId?: string;
    batchId?: string;
    sessionId?: string;
  };
  createdAt: string;
};

const MAX_RETRY_DELAY_MS = 20000;

const useRealtime = () => {
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { backendUser, syncStatus } = useAuthContext();
  const sourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectDelayMsRef = useRef(1500);
  const isActiveRef = useRef(true);

  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  useEffect(() => {
    const clearRealtimeConnection = () => {
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const invalidateOperationalQueries = (event: RealtimeEvent) => {
      if (event.type === "attendance.marked") {
        void queryClient.invalidateQueries({ queryKey: ["session-attendance"] });
        void queryClient.invalidateQueries({ queryKey: ["student-attendance"] });
        void queryClient.invalidateQueries({ queryKey: ["analytics"] });
      }

      if (event.type === "trainer.request.approved") {
        void queryClient.invalidateQueries({ queryKey: ["trainer-requests"] });
        void queryClient.invalidateQueries({ queryKey: ["institution-trainers"] });
      }

      if (event.type === "batch.created" || event.type === "trainer.assigned" || event.type === "student.joined.batch") {
        void queryClient.invalidateQueries({ queryKey: ["institution-batches"] });
        void queryClient.invalidateQueries({ queryKey: ["trainer-batches"] });
        void queryClient.invalidateQueries({ queryKey: ["analytics"] });
      }

      if (event.type === "session.created") {
        void queryClient.invalidateQueries({ queryKey: ["trainer-sessions"] });
        void queryClient.invalidateQueries({ queryKey: ["analytics"] });
      }
    };

    const connect = async () => {
      if (!isLoaded || !isSignedIn || !backendUser || syncStatus !== "success") {
        clearRealtimeConnection();
        return;
      }

      const token = await getToken();
      if (!token) {
        clearRealtimeConnection();
        return;
      }

      clearRealtimeConnection();
      const source = createRealtimeSource(token);
      sourceRef.current = source;

      source.onopen = () => {
        reconnectDelayMsRef.current = 1500;
      };

      source.onmessage = (messageEvent) => {
        try {
          const parsedEvent = JSON.parse(messageEvent.data) as RealtimeEvent;
          invalidateOperationalQueries(parsedEvent);
        } catch {
          return;
        }
      };

      source.onerror = () => {
        source.close();
        sourceRef.current = null;

        if (!isActiveRef.current) {
          return;
        }

        const nextDelay = reconnectDelayMsRef.current;
        reconnectDelayMsRef.current = Math.min(reconnectDelayMsRef.current * 2, MAX_RETRY_DELAY_MS);
        reconnectTimeoutRef.current = window.setTimeout(() => {
          void connect();
        }, nextDelay);
      };
    };

    void connect();

    return () => {
      clearRealtimeConnection();
    };
  }, [backendUser, getToken, isLoaded, isSignedIn, queryClient, syncStatus]);
};

export { useRealtime };
