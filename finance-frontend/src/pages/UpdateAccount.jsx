import api, { getApiErrorMessage } from "../services/api";

const updateAccount = async () => {

    try {

        const response = await api.put(
            `/accounts/${account.accountNumber}`,
            {
                accountholderName:
                    account.accountholderName,

                branchName:
                    account.branchName,

                accountType:
                    account.accountType,

                accountName:
                    account.accountName
            }
        );

        alert(
            typeof response.data === "string"
                ? response.data
                : "Account updated successfully."
        );

    } catch (error) {
        alert(getApiErrorMessage(error, "Failed to update account."));
    }
};