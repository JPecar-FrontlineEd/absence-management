module.exports = function() {
    return {
        "ProductId": "AbsMgmtDev",
        "Name": "Absence Mgmt Dev",
        "Description": null,
        "LegacyName": "Aesop (DEV)",
        "OrgNavigationUrlTemplate": "http:\/\/localhost.fldev.net:3000\/access?orgid={orgId}",
        "DefaultSignInUrl": "http:\/\/localhost.fldev.net:3000\/access",
        "ExternalIdProvider": "absenceAndTimeDev",
        "RequireInviteForRegistration": true,
        "DefaultOrganizationProvider": {
            "Name": "ec",
            "Url": "http:\/\/organizationservice\/v0.5\/api\/",
            "IsDefault": true
        },
        "AllowAllUsers": false,
        "AllowIdmAdministratorAccess": true,
        "IsTest": false,
        "SupportsMergration": true,
        "RequiresOrgIdForMergration": false,
        "AssociatedRoles": [{
            "Type": "abs_time_user_dev",
            "DisplayName": null,
            "Unique": false
        }]
    }
}