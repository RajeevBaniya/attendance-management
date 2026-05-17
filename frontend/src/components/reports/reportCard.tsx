import type { ReactNode } from "react";

import { Card } from "../ui/card";
import { SectionHeader } from "../ui/sectionHeader";

type ReportCardProps = {
  id?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

const ReportCard = ({ id, title, subtitle, children }: ReportCardProps) => {
  return (
    <Card id={id} className="scroll-mt-24">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="mt-4 space-y-3">{children}</div>
    </Card>
  );
};

export { ReportCard };
export type { ReportCardProps };
