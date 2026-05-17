import { Toast } from "./toast";
import type { ToastVariant } from "./toast";

type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContainerProps = {
  messages: ToastMessage[];
  onClose: (id: string) => void;
};

const TOAST_DURATION_MS = 3800;

const ToastContainer = ({ messages, onClose }: ToastContainerProps) => {
  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[60] flex w-[calc(100vw-24px)] flex-col gap-2 sm:right-4 sm:top-4 sm:w-auto">
      {messages.map((message) => (
        <div key={message.id} className="pointer-events-auto">
          <Toast
            id={message.id}
            title={message.title}
            description={message.description}
            variant={message.variant}
            durationMs={TOAST_DURATION_MS}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
};

export { ToastContainer };
export type { ToastContainerProps, ToastMessage };
