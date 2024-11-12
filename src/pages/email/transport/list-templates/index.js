import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { CippTablePage } from "/src/components/CippComponents/CippTablePage.jsx";

const Page = () => {
  const pageTitle = "Transport Rule Templates";

  const actions = [
    {
      label: "View Template",
      icon: <EyeIcon />, // Placeholder icon for developer customization
      color: "success",
      offCanvas: true,
    },
    {
      label: "Delete Template",
      type: "POST",
      url: "/api/RemoveTransportRuleTemplate",
      data: { ID: "GUID" },
      confirmText: "Do you want to delete the template?",
      icon: <TrashIcon />, // Placeholder icon for developer customization
      color: "danger",
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["name", "comments", "GUID"],
    actions: actions,
  };

  const simpleColumns = ["name", "comments", "GUID"];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListTransportRulesTemplates"
      apiData={{
        TenantFilter: "Tenant",
      }}
      apiDataKey="Results"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      titleButton={{
        label: "Add Template",
        href: "/email/transport/add-template",
      }}
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;