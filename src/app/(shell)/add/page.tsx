import { AddChoices } from "@/components/AddChoices";
import { PageHeader } from "@/components/ui";
import { ar } from "@/lib/ar";

export default function AddPage() {
  return (
    <>
      <PageHeader title={ar.add.title} />
      <AddChoices />
    </>
  );
}
