import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { useSettings } from "/src/hooks/use-settings";
import { useRouter } from "next/router";
import { ApiGetCall, ApiPostCall } from "/src/api/ApiCall";
import CippFormSkeleton from "/src/components/CippFormPages/CippFormSkeleton";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import {
  Check,
  Error,
  Mail,
  Fingerprint,
  Launch,
  Delete,
  Star,
  Close,
  CalendarToday,
  AlternateEmail,
  PersonAdd,
} from "@mui/icons-material";
import { HeaderedTabbedLayout } from "../../../../../layouts/HeaderedTabbedLayout";
import tabOptions from "./tabOptions";
import { CippTimeAgo } from "../../../../../components/CippComponents/CippTimeAgo";
import { CippCopyToClipBoard } from "../../../../../components/CippComponents/CippCopyToClipboard";
import { Box, Stack } from "@mui/system";
import { Grid } from "@mui/system";
import { CippBannerListCard } from "../../../../../components/CippCards/CippBannerListCard";
import { CippExchangeInfoCard } from "../../../../../components/CippCards/CippExchangeInfoCard";
import { useEffect, useState } from "react";
import CippExchangeSettingsForm from "../../../../../components/CippFormPages/CippExchangeSettingsForm";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Collapse,
  CircularProgress,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  Tooltip,
  Chip,
} from "@mui/material";
import { CippApiResults } from "../../../../../components/CippComponents/CippApiResults";
import { Block, PlayArrow, Add } from "@mui/icons-material";
import { CippPropertyListCard } from "../../../../../components/CippCards/CippPropertyListCard";
import { getCippTranslation } from "../../../../../utils/get-cipp-translation";
import { getCippFormatting } from "../../../../../utils/get-cipp-formatting";
import CippExchangeActions from "../../../../../components/CippComponents/CippExchangeActions";
import { CippApiDialog } from "../../../../../components/CippComponents/CippApiDialog";
import { useDialog } from "../../../../../hooks/use-dialog";
import { CippFormComponent } from "../../../../../components/CippComponents/CippFormComponent";

const Page = () => {
  const userSettingsDefaults = useSettings();
  const [waiting, setWaiting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [actionData, setActionData] = useState({ ready: false });
  const [showAddAliasDialog, setShowAddAliasDialog] = useState(false);
  const [newAlias, setNewAlias] = useState("");
  const [aliasList, setAliasList] = useState([]);
  const [submitResult, setSubmitResult] = useState(null);
  const [showAddPermissionsDialog, setShowAddPermissionsDialog] = useState(false);
  const [isSubmittingPermissions, setIsSubmittingPermissions] = useState(false);
  const [submitPermissionsResult, setSubmitPermissionsResult] = useState(null);
  const [autoMap, setAutoMap] = useState(true);
  const createDialog = useDialog();
  const router = useRouter();
  const { userId } = router.query;
  const [showAddCalendarPermissionsDialog, setShowAddCalendarPermissionsDialog] = useState(false);
  const [isSubmittingCalendarPermissions, setIsSubmittingCalendarPermissions] = useState(false);
  const [submitCalendarPermissionsResult, setSubmitCalendarPermissionsResult] = useState(null);

  const formControl = useForm({
    mode: "onChange",
    defaultValues: {
      tenantFilter: userSettingsDefaults.currentTenant,
    },
  });
  const graphUserRequest = ApiGetCall({
    url: `/api/ListUsers?UserId=${userId}&tenantFilter=${userSettingsDefaults.currentTenant}`,
    queryKey: `ListUsers-${userId}`,
    waiting: waiting,
  });
  const userRequest = ApiGetCall({
    url: `/api/ListUserMailboxDetails?UserId=${userId}&tenantFilter=${userSettingsDefaults.currentTenant}`,
    queryKey: `Mailbox-${userId}`,
    waiting: waiting,
  });

  const usersList = ApiGetCall({
    url: "/api/ListGraphRequest",
    data: {
      Endpoint: `users`,
      tenantFilter: userSettingsDefaults.currentTenant,
      $select: "id,displayName,userPrincipalName,mail",
      noPagination: true,
      $top: 999,
    },
    queryKey: `UserNames-${userSettingsDefaults.currentTenant}`,
  });

  const oooRequest = ApiGetCall({
    url: `/api/ListOoO?UserId=${userId}&tenantFilter=${userSettingsDefaults.currentTenant}`,
    queryKey: `ooo-${userId}`,
    waiting: waiting,
  });

  const calPermissions = ApiGetCall({
    url: `/api/ListCalendarPermissions?UserId=${userId}&tenantFilter=${userSettingsDefaults.currentTenant}`,
    queryKey: `CalendarPermissions-${userId}`,
    waiting: waiting,
  });

  const mailboxRulesRequest = ApiGetCall({
    url: `/api/ListUserMailboxRules?UserId=${userId}&tenantFilter=${userSettingsDefaults.currentTenant}`,
    queryKey: `MailboxRules-${userId}`,
    waiting: waiting,
  });

  const permissionsFormControl = useForm({
    mode: "onChange",
    defaultValues: {
      fullAccess: "",
      sendAs: "",
      sendOnBehalf: "",
      autoMap: true,
    },
  });

  const fullAccessValue = permissionsFormControl.watch("fullAccess");

  const setUserAliases = ApiPostCall({
    relatedQueryKeys: `ListUsers-${userId}`,
    datafromUrl: true,
  });

  useEffect(() => {
    const subscription = permissionsFormControl.watch((value, { name, type }) => {});
    return () => subscription.unsubscribe();
  }, [permissionsFormControl]);

  useEffect(() => {
    if (showAddPermissionsDialog) {
      permissionsFormControl.reset({
        fullAccess: "",
        sendAs: "",
        sendOnBehalf: "",
        autoMap: true,
      });
      usersList.refetch();
    }
  }, [showAddPermissionsDialog]);

  useEffect(() => {
    if (oooRequest.isSuccess) {
      formControl.setValue("ooo.ExternalMessage", oooRequest.data?.ExternalMessage);
      formControl.setValue("ooo.InternalMessage", oooRequest.data?.InternalMessage);
      formControl.setValue("ooo.AutoReplyState", {
        value: oooRequest.data?.AutoReplyState,
        label: oooRequest.data?.AutoReplyState,
      });
      formControl.setValue(
        "ooo.StartTime",
        new Date(oooRequest.data?.StartTime).getTime() / 1000 || null
      );
      formControl.setValue(
        "ooo.EndTime",
        new Date(oooRequest.data?.EndTime).getTime() / 1000 || null
      );
    }
  }, [oooRequest.isSuccess]);

  useEffect(() => {
    //if userId is defined, we can fetch the user data
    if (userId) {
      setWaiting(true);
    }
  }, [userId]);

  const title = graphUserRequest.isSuccess ? graphUserRequest.data?.[0]?.displayName : "Loading...";

  const subtitle = graphUserRequest.isSuccess
    ? [
        {
          icon: <Mail />,
          text: (
            <CippCopyToClipBoard type="chip" text={graphUserRequest.data?.[0]?.userPrincipalName} />
          ),
        },
        {
          icon: <Fingerprint />,
          text: <CippCopyToClipBoard type="chip" text={graphUserRequest.data?.[0]?.id} />,
        },
        {
          icon: <CalendarIcon />,
          text: (
            <>
              Created: <CippTimeAgo data={graphUserRequest.data?.[0]?.createdDateTime} />
            </>
          ),
        },
        {
          icon: <Launch style={{ color: "#667085" }} />,
          text: (
            <Button
              color="muted"
              style={{ paddingLeft: 0 }}
              size="small"
              href={`https://entra.microsoft.com/${userSettingsDefaults.currentTenant}/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${userId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View in Entra
            </Button>
          ),
        },
      ]
    : [];

  const data = userRequest.data?.[0];

  const mailboxPermissionActions = [
    {
      label: "Remove Permission",
      type: "POST",
      icon: <Delete />,
      url: "/api/ExecModifyMBPerms",
      data: {
        userID: graphUserRequest.data?.[0]?.userPrincipalName,
        tenantFilter: userSettingsDefaults.currentTenant,
        permissions: [
          {
            UserID: "User",
            PermissionLevel: "AccessRights",
            Modification: "Remove",
          },
        ],
      },
      confirmText: "Are you sure you want to remove this permission?",
      multiPost: false,
      relatedQueryKeys: `Mailbox-${userId}`,
    },
  ];

  const addPermissionsMutation = ApiPostCall({
    relatedQueryKeys: `Mailbox-${userId}`,
  });

  const handleAddPermissions = () => {
    const values = formControl.getValues();
    const permissions = [];

    // Build permissions array based on form values
    if (values.permissions?.AddFullAccess) {
      permissions.push({
        UserID: values.permissions.AddFullAccess,
        PermissionLevel: "FullAccess",
        Modification: "Add",
        AutoMap: autoMap,
      });
    }
    if (values.permissions?.AddSendAs) {
      permissions.push({
        UserID: values.permissions.AddSendAs,
        PermissionLevel: "SendAs",
        Modification: "Add",
      });
    }
    if (values.permissions?.AddSendOnBehalf) {
      permissions.push({
        UserID: values.permissions.AddSendOnBehalf,
        PermissionLevel: "SendOnBehalf",
        Modification: "Add",
      });
    }

    if (permissions.length === 0) return;

    setIsSubmittingPermissions(true);
    setSubmitPermissionsResult(null);

    addPermissionsMutation.mutate(
      {
        url: "/api/ExecModifyMBPerms",
        data: {
          userID: graphUserRequest.data?.[0]?.userPrincipalName,
          tenantFilter: userSettingsDefaults.currentTenant,
          permissions: permissions,
        },
      },
      {
        onSuccess: (response) => {
          setSubmitPermissionsResult({
            success: true,
            message: response.data?.Results?.join("\n") || "Permissions added successfully",
          });
          userRequest.refetch();
          setTimeout(() => {
            setShowAddPermissionsDialog(false);
            formControl.reset();
            setSubmitPermissionsResult(null);
          }, 1500);
        },
        onError: (error) => {
          setSubmitPermissionsResult({
            success: false,
            message: error.message || "Failed to add permissions",
          });
        },
      }
    );
  };

  const handleOpenPermissionsDialog = () => {
    setShowAddPermissionsDialog(true);
  };

  const permissions = [
    {
      id: 1,
      cardLabelBox: {
        cardLabelBoxHeader: userRequest.isFetching ? (
          <CircularProgress size="25px" color="inherit" />
        ) : userRequest.data?.[0]?.Permissions?.length !== 0 ? (
          <Check />
        ) : (
          <Error />
        ),
      },
      text: "Mailbox Permissions",
      subtext:
        userRequest.data?.[0]?.Permissions?.length !== 0
          ? "Other users have access to this mailbox"
          : "No other users have access to this mailbox",
      statusColor: "green.main",
      cardLabelBoxActions: (
        <Button
          startIcon={<PersonAdd />}
          onClick={handleOpenPermissionsDialog}
          variant="outlined"
          color="primary"
          size="small"
        >
          Add Permissions
        </Button>
      ),
      table: {
        title: "Mailbox Permissions",
        hideTitle: true,
        data:
          userRequest.data?.[0]?.Permissions?.map((permission) => ({
            User: permission.User,
            AccessRights: permission.AccessRights,
            _raw: permission,
          })) || [],
        refreshFunction: () => userRequest.refetch(),
        isFetching: userRequest.isFetching,
        simpleColumns: ["User", "AccessRights"],
        actions: mailboxPermissionActions,
        offCanvas: {
          children: (data) => {
            return (
              <CippPropertyListCard
                cardSx={{ p: 0, m: -2 }}
                title="Permission Details"
                propertyItems={[
                  {
                    label: "User",
                    value: data.User,
                  },
                  {
                    label: "Access Rights",
                    value: data.AccessRights,
                  },
                ]}
                actionItems={mailboxPermissionActions}
              />
            );
          },
        },
      },
    },
  ];

  const calCard = [
    {
      id: 1,
      cardLabelBox: {
        cardLabelBoxHeader: calPermissions.isFetching ? (
          <CircularProgress size="25px" color="inherit" />
        ) : calPermissions.data?.length !== 0 ? (
          <Check />
        ) : (
          <Error />
        ),
      },
      text: "Calendar permissions",
      subtext: calPermissions.data?.length !== 0
        ? "Other users have access to this calendar"
        : "No other users have access to this calendar",
      statusColor: "green.main",
      cardLabelBoxActions: (
        <Button
          startIcon={<CalendarToday />}
          onClick={() => setShowAddCalendarPermissionsDialog(true)}
          variant="outlined"
          color="primary"
          size="small"
        >
          Add Permissions
        </Button>
      ),
      table: {
        title: "Calendar Permissions",
        hideTitle: true,
        data: calPermissions.data?.map(permission => ({
          User: permission.User,
          AccessRights: permission.AccessRights.join(", "),
          FolderName: permission.FolderName,
          _raw: permission
        })) || [],
        refreshFunction: () => calPermissions.refetch(),
        isFetching: calPermissions.isFetching,
        simpleColumns: ["User", "AccessRights", "FolderName"],
        actions: [
          {
            label: "Remove Permission",
            type: "POST",
            icon: <Delete />,
            url: "/api/ExecModifyCalPerms",
            data: {
              userID: graphUserRequest.data?.[0]?.userPrincipalName,
              tenantFilter: userSettingsDefaults.currentTenant,
              permissions: [{
                UserID: "User",
                PermissionLevel: "AccessRights",
                FolderName: "FolderName",
                Modification: "Remove"
              }]
            },
            confirmText: "Are you sure you want to remove this calendar permission?",
            multiPost: false,
            relatedQueryKeys: `CalendarPermissions-${userId}`,
            hideBulk: true
          }
        ],
        offCanvas: {
          children: (data) => {
            return (
              <CippPropertyListCard
                cardSx={{ p: 0, m: -2 }}
                title="Permission Details"
                propertyItems={[
                  {
                    label: "User",
                    value: data.User,
                  },
                  {
                    label: "Access Rights",
                    value: data.AccessRights,
                  },
                  {
                    label: "Folder Name",
                    value: data.FolderName,
                  }
                ]}
                actionItems={[
                  {
                    label: "Remove Permission",
                    type: "POST",
                    icon: <Delete />,
                    url: "/api/ExecModifyCalPerms",
                    data: {
                      userID: graphUserRequest.data?.[0]?.userPrincipalName,
                      tenantFilter: userSettingsDefaults.currentTenant,
                      permissions: [{
                        UserID: data.User,
                        PermissionLevel: data.AccessRights,
                        FolderName: data.FolderName,
                        Modification: "Remove"
                      }]
                    },
                    confirmText: "Are you sure you want to remove this calendar permission?",
                    multiPost: false,
                    relatedQueryKeys: `CalendarPermissions-${userId}`,
                  }
                ]}
              />
            );
          },
        },
      },
    },
  ];

  const mailboxRuleActions = [
    {
      label: "Enable Mailbox Rule",
      type: "POST",
      icon: <PlayArrow />,
      url: "/api/ExecSetMailboxRule",
      data: {
        ruleId: "Identity",
        userPrincipalName: graphUserRequest.data?.[0]?.userPrincipalName,
        ruleName: "Name",
        Enable: true,
      },
      condition: (row) => !row.Enabled,
      confirmText: "Are you sure you want to enable this mailbox rule?",
      multiPost: false,
    },
    {
      label: "Disable Mailbox Rule",
      type: "POST",
      icon: <Block />,
      url: "/api/ExecSetMailboxRule",
      data: {
        ruleId: "Identity",
        userPrincipalName: graphUserRequest.data?.[0]?.userPrincipalName,
        ruleName: "Name",
        Disable: true,
      },
      condition: (row) => row.Enabled,
      confirmText: "Are you sure you want to disable this mailbox rule?",
      multiPost: false,
    },
    {
      label: "Remove Mailbox Rule",
      type: "POST",
      icon: <Delete />,
      url: "/api/ExecRemoveMailboxRule",
      data: {
        ruleId: "Identity",
        ruleName: "Name",
        userPrincipalName: graphUserRequest.data?.[0]?.userPrincipalName,
      },
      confirmText: "Are you sure you want to remove this mailbox rule?",
      multiPost: false,
      relatedQueryKeys: `MailboxRules-${userId}`,
    },
  ];

  const mailboxRulesCard = [
    {
      id: 1,
      cardLabelBox: {
        cardLabelBoxHeader: mailboxRulesRequest.isFetching ? (
          <CircularProgress size="25px" color="inherit" />
        ) : mailboxRulesRequest.data?.length !== 0 ? (
          <Check />
        ) : (
          <Error />
        ),
      },
      text: "Current Mailbox Rules",
      subtext: mailboxRulesRequest.data?.length
        ? "Mailbox rules are configured for this user"
        : "No mailbox rules configured for this user",
      statusColor: "green.main",
      table: {
        title: "Mailbox Rules",
        hideTitle: true,
        data: mailboxRulesRequest.data || [],
        refreshFunction: () => mailboxRulesRequest.refetch(),
        isFetching: mailboxRulesRequest.isFetching,
        simpleColumns: ["Enabled", "Name", "Description", "Priority"],
        actions: mailboxRuleActions,
        offCanvas: {
          children: (data) => {
            const keys = Object.keys(data).filter(
              (key) => !key.includes("@odata") && !key.includes("@data")
            );
            const properties = [];
            keys.forEach((key) => {
              if (data[key] && data[key].length > 0) {
                properties.push({
                  label: getCippTranslation(key),
                  value: getCippFormatting(data[key], key),
                });
              }
            });
            return (
              <CippPropertyListCard
                cardSx={{ p: 0, m: -2 }}
                title="Rule Details"
                propertyItems={properties}
                actionItems={mailboxRuleActions}
              />
            );
          },
        },
      },
    },
  ];

  const proxyAddressActions = [
    {
      label: "Make Primary",
      type: "POST",
      icon: <Star />,
      url: "/api/SetUserAliases",
      data: {
        id: userId,
        tenantFilter: userSettingsDefaults.currentTenant,
        MakePrimary: "Address",
      },
      confirmText: "Are you sure you want to make this the primary proxy address?",
      multiPost: false,
      relatedQueryKeys: `ListUsers-${userId}`,
    },
    {
      label: "Remove Proxy Address",
      type: "POST",
      icon: <Delete />,
      url: "/api/SetUserAliases",
      data: {
        id: userId,
        tenantFilter: userSettingsDefaults.currentTenant,
        RemovedAliases: "Address",
      },
      confirmText: "Are you sure you want to remove this proxy address?",
      multiPost: false,
      relatedQueryKeys: `ListUsers-${userId}`,
    },
  ];

  const handleAddAlias = () => {
    if (newAlias.trim()) {
      setAliasList([...aliasList, newAlias.trim()]);
      setNewAlias("");
    }
  };

  const handleDeleteAlias = (aliasToDelete) => {
    setAliasList(aliasList.filter((alias) => alias !== aliasToDelete));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddAlias();
    }
  };

  const handleAddAliases = () => {
    if (aliasList.length > 0) {
      setSubmitResult(null);

      setUserAliases.mutate({
        url: "/api/SetUserAliases",
        data: {
          id: userId,
          tenantFilter: userSettingsDefaults.currentTenant,
          AddedAliases: aliasList.join(","),
          userPrincipalName: graphUserRequest.data?.[0]?.userPrincipalName,
        },
        onSuccess: (response) => {
          setSubmitResult({
            success: true,
            message: response.message || "Aliases added successfully",
          });
          graphUserRequest.refetch();
          setTimeout(() => {
            setShowAddAliasDialog(false);
            setAliasList([]);
            setNewAlias("");
            setSubmitResult(null);
          }, 1500);
        },
        onError: (error) => {
          setSubmitResult({ success: false, message: error.message || "Failed to add aliases" });
        },
      });
    }
  };

  const proxyAddressesCard = [
    {
      id: 1,
      cardLabelBox: {
        cardLabelBoxHeader: graphUserRequest.isFetching ? (
          <CircularProgress size="25px" color="inherit" />
        ) : graphUserRequest.data?.[0]?.proxyAddresses?.length > 1 ? (
          <Check />
        ) : (
          <Error />
        ),
      },
      text: "Proxy Addresses",
      subtext:
        graphUserRequest.data?.[0]?.proxyAddresses?.length > 1
          ? "Proxy addresses are configured for this user"
          : "No proxy addresses configured for this user",
      statusColor: "green.main",
      cardLabelBoxActions: (
        <Button
          startIcon={<AlternateEmail />}
          onClick={() => setShowAddAliasDialog(true)}
          variant="outlined"
          color="primary"
          size="small"
        >
          Add Alias
        </Button>
      ),
      table: {
        title: "Proxy Addresses",
        hideTitle: true,
        data:
          graphUserRequest.data?.[0]?.proxyAddresses?.map((address) => ({
            Address: address,
            Type: address.startsWith("SMTP:") ? "Primary" : "Alias",
          })) || [],
        refreshFunction: () => graphUserRequest.refetch(),
        isFetching: graphUserRequest.isFetching,
        simpleColumns: ["Address", "Type"],
        actions: proxyAddressActions,
        offCanvas: {
          children: (data) => {
            return (
              <CippPropertyListCard
                cardSx={{ p: 0, m: -2 }}
                title="Address Details"
                propertyItems={[
                  {
                    label: "Address",
                    value: data.Address,
                  },
                  {
                    label: "Type",
                    value: data.Type,
                  },
                ]}
                actionItems={proxyAddressActions}
              />
            );
          },
        },
      },
    },
  ];

  const permissionsApiRequest = {
    isSuccess: submitPermissionsResult?.success,
    isError: submitPermissionsResult?.success === false,
    error: submitPermissionsResult?.success === false ? submitPermissionsResult?.message : null,
    data: submitPermissionsResult?.success ? { message: submitPermissionsResult?.message } : null,
  };

  const calendarPermissionsFormControl = useForm({
    mode: "onChange",
    defaultValues: {
      UserToGetPermissions: null,
      Permissions: null,
      CanViewPrivateItems: false,
      FolderName: "Calendar"
    },
  });

  const handleAddCalendarPermissions = () => {
    const values = calendarPermissionsFormControl.getValues();
    if (!values.UserToGetPermissions || !values.Permissions) return;

    setIsSubmittingCalendarPermissions(true);
    setSubmitCalendarPermissionsResult(null);
    
    // Build permission object dynamically
    const permission = {
      UserID: values.UserToGetPermissions,
      PermissionLevel: values.Permissions,
      Modification: "Add"
    };
    if (values.CanViewPrivateItems) {
      permission.CanViewPrivateItems = true;
    }

    addPermissionsMutation.mutate({
      url: '/api/ExecModifyCalPerms',
      data: {
        userID: graphUserRequest.data?.[0]?.userPrincipalName,
        tenantFilter: userSettingsDefaults.currentTenant,
        permissions: [permission]
      }
    }, {
      onSuccess: (response) => {
        setSubmitCalendarPermissionsResult({ success: true, message: response.data?.Results?.join('\n') || 'Calendar permissions added successfully' });
        calPermissions.refetch();
        setTimeout(() => {
          setShowAddCalendarPermissionsDialog(false);
          calendarPermissionsFormControl.reset();
          setSubmitCalendarPermissionsResult(null);
        }, 1500);
      },
      onError: (error) => {
        // Try to extract a detailed message from the API response
        const apiMessage =
          error?.response?.data?.Results?.join('\n') ||
          error?.message ||
          'Failed to add calendar permissions';
        setSubmitCalendarPermissionsResult({ success: false, message: apiMessage });
      },
      onSettled: () => {
        setIsSubmittingCalendarPermissions(false);
      }
    });
  };

  const calendarPermissionsApiRequest = {
    isSuccess: submitCalendarPermissionsResult?.success,
    isError: submitCalendarPermissionsResult?.success === false,
    error: submitCalendarPermissionsResult?.success === false ? submitCalendarPermissionsResult?.message : null,
    data: submitCalendarPermissionsResult?.success ? { message: submitCalendarPermissionsResult?.message } : null,
  };

  return (
    <HeaderedTabbedLayout
      tabOptions={tabOptions}
      title={title}
      subtitle={subtitle}
      actions={CippExchangeActions()}
      actionsData={userRequest.data?.[0]?.MailboxActionsData}
      isFetching={graphUserRequest.isLoading}
    >
      <CippApiResults apiObject={userRequest} errorsOnly={true} />
      {graphUserRequest.isLoading && <CippFormSkeleton layout={[2, 1, 2, 2]} />}
      {graphUserRequest.isSuccess && (
        <Box
          sx={{
            flexGrow: 1,
            py: 4,
            mr: 2,
          }}
        >
          <Grid container spacing={2}>
            {userRequest?.data?.[0]?.Mailbox?.[0]?.error && (
              <Grid item size={12}>
                <Alert severity="error">
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">
                      {userRequest?.data?.[0]?.Mailbox?.[0]?.error.includes(
                        "Microsoft.Exchange.Configuration.Tasks.ManagementObjectNotFoundException"
                      )
                        ? "This user does not have a mailbox, make sure they are licensed for Exchange."
                        : "An error occurred while fetching the mailbox details."}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => setShowDetails(!showDetails)}
                      sx={{ mr: 1 }}
                    >
                      {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                  </Box>
                  <Collapse in={showDetails}>
                    <Box mt={2}>{userRequest?.data?.[0]?.Mailbox?.[0]?.error}</Box>
                  </Collapse>
                </Alert>
              </Grid>
            )}
            {!userRequest?.data?.[0]?.Mailbox?.[0]?.error?.includes(
              "Microsoft.Exchange.Configuration.Tasks.ManagementObjectNotFoundException"
            ) && (
              <>
                <Grid item size={4}>
                  <CippExchangeInfoCard
                    exchangeData={data}
                    isLoading={userRequest.isLoading}
                    isFetching={userRequest.isFetching}
                    handleRefresh={() => userRequest.refetch()}
                  />
                </Grid>
                <Grid item size={8}>
                  <Stack spacing={3}>
                    <CippBannerListCard
                      isFetching={graphUserRequest.isLoading}
                      items={proxyAddressesCard}
                      isCollapsible={graphUserRequest.data?.[0]?.proxyAddresses?.length !== 0}
                    />
                    <CippBannerListCard
                      isFetching={userRequest.isLoading}
                      items={permissions}
                      isCollapsible={userRequest.data?.[0]?.Permissions?.length !== 0}
                    />
                    <CippBannerListCard
                      isFetching={calPermissions.isLoading}
                      items={calCard}
                      isCollapsible={calPermissions.data?.length !== 0}
                    />
                    <CippBannerListCard
                      isFetching={mailboxRulesRequest.isLoading}
                      items={mailboxRulesCard}
                      isCollapsible={mailboxRulesRequest.data?.length !== 0}
                    />
                    <CippExchangeSettingsForm
                      userId={userId}
                      calPermissions={calPermissions.data}
                      currentSettings={userRequest.data?.[0]}
                      isFetching={userRequest.isFetching}
                      formControl={formControl}
                    />
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      )}
      {actionData.ready && (
        <CippApiDialog
          createDialog={createDialog}
          title="Confirmation"
          api={actionData.action}
          row={actionData.data}
        />
      )}
      <Dialog
        open={showAddAliasDialog}
        onClose={() => setShowAddAliasDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Add Proxy Addresses</Typography>
            <IconButton onClick={() => setShowAddAliasDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Add proxy addresses (aliases) for this user. Enter each alias and click Add or press Enter.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter an alias"
                variant="outlined"
                disabled={setUserAliases.isPending}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'monospace',
                    '& .MuiOutlinedInput-input': {
                      px: 2
                    }
                  }
                }}
              />
              <Button
                onClick={handleAddAlias}
                variant="contained"
                disabled={!newAlias.trim() || setUserAliases.isPending}
                startIcon={<Add />}
                size="small"
              >
                Add
              </Button>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              minHeight: '40px',
              p: 1,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {aliasList.length === 0 ? (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    px: 2,
                    py: 1,
                    textAlign: 'center',
                    width: '100%'
                  }}
                >
                  No aliases added yet
                </Typography>
              ) : (
                aliasList.map((alias) => (
                  <Chip
                    key={alias}
                    label={alias}
                    onDelete={() => handleDeleteAlias(alias)}
                    color="primary"
                    variant="outlined"
                  />
                ))
              )}
            </Box>
            <CippApiResults apiObject={setUserAliases} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => {
              setShowAddAliasDialog(false);
              setAliasList([]);
              setNewAlias("");
            }} 
            disabled={setUserAliases.isPending}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAliases}
            variant="contained"
            color="primary"
            disabled={aliasList.length === 0 || setUserAliases.isPending}
            startIcon={
              setUserAliases.isPending ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {setUserAliases.isPending ? "Adding..." : "Add Aliases"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showAddPermissionsDialog}
        onClose={() => setShowAddPermissionsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Add Mailbox Permissions
            <IconButton onClick={() => setShowAddPermissionsDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <CippFormComponent
                type="autoComplete"
                label="Add Full Access"
                name="permissions.AddFullAccess"
                isFetching={userRequest.isFetching || usersList.isFetching}
                options={
                  usersList?.data?.Results?.map((user) => ({
                    value: user.userPrincipalName,
                    label: `${user.displayName} (${user.userPrincipalName})`,
                  })) || []
                }
                formControl={formControl}
              />
              {formControl.watch("permissions.AddFullAccess") && (
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={autoMap}
                      onChange={(e) => {
                        setAutoMap(e.target.checked);
                      }}
                    />
                  }
                  label="Enable Automapping"
                  sx={{ mt: 0.5, ml: 0.5 }}
                />
              )}
            </Box>
            <Box>
              <CippFormComponent
                type="autoComplete"
                label="Add Send-as Permissions"
                name="permissions.AddSendAs"
                isFetching={userRequest.isFetching || usersList.isFetching}
                options={
                  usersList?.data?.Results?.map((user) => ({
                    value: user.userPrincipalName,
                    label: `${user.displayName} (${user.userPrincipalName})`,
                  })) || []
                }
                formControl={formControl}
              />
            </Box>
            <Box>
              <CippFormComponent
                type="autoComplete"
                label="Add Send On Behalf Permissions"
                name="permissions.AddSendOnBehalf"
                isFetching={userRequest.isFetching || usersList.isFetching}
                options={
                  usersList?.data?.Results?.map((user) => ({
                    value: user.userPrincipalName,
                    label: `${user.displayName} (${user.userPrincipalName})`,
                  })) || []
                }
                formControl={formControl}
              />
            </Box>
            <CippApiResults apiObject={permissionsApiRequest} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={() => setShowAddPermissionsDialog(false)}
            disabled={isSubmittingPermissions}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPermissions}
            variant="contained"
            color="primary"
            disabled={
              (!formControl.watch("permissions.AddFullAccess") &&
                !formControl.watch("permissions.AddSendAs") &&
                !formControl.watch("permissions.AddSendOnBehalf")) ||
              isSubmittingPermissions
            }
            startIcon={
              isSubmittingPermissions ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isSubmittingPermissions ? "Adding..." : "Add Permissions"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog 
        open={showAddCalendarPermissionsDialog} 
        onClose={() => setShowAddCalendarPermissionsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Add Calendar Permissions
            <IconButton onClick={() => setShowAddCalendarPermissionsDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <CippFormComponent
                type="autoComplete"
                label="Add Access"
                name="UserToGetPermissions"
                isFetching={userRequest.isFetching || usersList.isFetching}
                options={
                  usersList?.data?.Results?.map((user) => ({
                    value: user.userPrincipalName,
                    label: `${user.displayName} (${user.userPrincipalName})`,
                  })) || []
                }
                multiple={false}
                formControl={calendarPermissionsFormControl}
              />
            </Box>
            <Box>
              <CippFormComponent
                type="autoComplete"
                label="Permission Level"
                name="Permissions"
                required={true}
                validators={{
                  validate: (value) =>
                    value ? true : "Select the permission level for the calendar",
                }}
                isFetching={userRequest.isFetching || usersList.isFetching}
                options={[
                  { value: "Author", label: "Author" },
                  { value: "Contributor", label: "Contributor" },
                  { value: "Editor", label: "Editor" },
                  { value: "Owner", label: "Owner" },
                  { value: "NonEditingAuthor", label: "Non Editing Author" },
                  { value: "PublishingAuthor", label: "Publishing Author" },
                  { value: "PublishingEditor", label: "Publishing Editor" },
                  { value: "Reviewer", label: "Reviewer" },
                  { value: "LimitedDetails", label: "Limited Details" },
                  { value: "AvailabilityOnly", label: "Availability Only" },
                ]}
                multiple={false}
                formControl={calendarPermissionsFormControl}
              />
            </Box>
            <Box>
              {(() => {
                const permissionLevel = calendarPermissionsFormControl.watch("Permissions");
                const isEditor = permissionLevel?.value === "Editor";
                
                useEffect(() => {
                  if (!isEditor) {
                    calendarPermissionsFormControl.setValue("CanViewPrivateItems", false);
                  }
                }, [isEditor, calendarPermissionsFormControl]);
                
                return (
                  <Tooltip 
                    title={!isEditor ? "Only usable when permission level is Editor" : ""}
                    followCursor
                    placement="right"
                  >
                    <span>
                      <CippFormComponent
                        type="switch"
                        label="Can view Private items"
                        name="CanViewPrivateItems"
                        formControl={calendarPermissionsFormControl}
                        disabled={!isEditor}
                      />
                    </span>
                  </Tooltip>
                );
              })()}
            </Box>
            <CippApiResults apiObject={calendarPermissionsApiRequest} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button 
            onClick={() => setShowAddCalendarPermissionsDialog(false)}
            disabled={isSubmittingCalendarPermissions}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddCalendarPermissions} 
            variant="contained" 
            color="primary"
            disabled={(!calendarPermissionsFormControl.watch("UserToGetPermissions") || 
                      !calendarPermissionsFormControl.watch("Permissions")) || 
                      isSubmittingCalendarPermissions}
            startIcon={isSubmittingCalendarPermissions ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmittingCalendarPermissions ? 'Adding...' : 'Add Permissions'}
          </Button>
        </DialogActions>
      </Dialog>
    </HeaderedTabbedLayout>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
