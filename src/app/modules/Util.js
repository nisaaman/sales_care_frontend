import moment from "moment";

export const handlePasteDisable = (e) => {
    e.preventDefault();
};

export const allowOnlyNumeric = (event) => {
    if ((event.target.value.length == 0 && event.charCode == 48) || !(event.charCode >= 48 && event.charCode <= 57)) {
        event.preventDefault();
    }
}

export const allowOnlyNumericWithZero = (event) => {
    if (!(event.charCode >= 48 && event.charCode <= 57)) {
        event.preventDefault();
    }
}

export const allowOnlyNumericWithPeriod = (event) => {

    if (event.charCode != 46 && !(event.charCode >= 48 && event.charCode <= 57)) {
        event.preventDefault();
    }
}

export const allowOnlyNumericWithPeriodAndRestrictDecimalTwo = (event) => {
   
    if ((event.target.value.length == 0 && event.charCode == 48) || event.charCode != 46 && !(event.charCode >= 48 && event.charCode <= 57)) {
        event.preventDefault();
    }
    if (event.charCode == 46) {
         if(!(event.target.value.indexOf(".") > -1)) {
             return true;
         }
         else
             event.preventDefault();


        var pointIndex = event.target.value.indexOf('.');
         if( pointIndex < event.target.value.length - 2) {
                event.preventDefault();
            }
    }
    

}

export const amountFormatterWithCurrency = (amount, currency) => {

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export const amountFormatterWithoutCurrency = (amount) => {

    return new Intl.NumberFormat('en-NZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function getDayDiff(strFromDate, strToDate, dateFormat) { //"YYYY-MM-DD"
    let f = moment(strFromDate, dateFormat)
    let t = moment(strToDate, dateFormat)
    return t.diff(f, 'days');
}

export function getDaysCount(strFromDate, strToDate, dateFormat) { //"YYYY-MM-DD"
    let f = moment(strFromDate, dateFormat)
    let t = moment(strToDate, dateFormat)
    return 1 + t.diff(f, 'days');
}

export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export function dateFormatPattern() {
    return "DD-MMM-YYYY";
}

export function hasAcess(permissions, activityFeature) {
    const index = permissions.findIndex(obj => obj.activityFeature === activityFeature);
    if (index > -1) {
        if (permissions[index].isCreate || permissions[index].isUpdate
            || permissions[index].isDelete || permissions[index].isView) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function hasAnyAcess(permissions, activityFeatureList) {
    let hasPermission = false;
    if (activityFeatureList.length > 0) {
        for (let index = 0; index < activityFeatureList.length; index++) {
            const activityFeature = activityFeatureList[index];

            if (hasAcess(permissions, activityFeature)) {
                hasPermission = true;
                break;
            }
        }
        return hasPermission;
    } else {
        return false;
    }
}

export function hasCreateAccess(permissions, activityFeature) {

    permissions = permissions.filter(function (permission) {
        return permission.activityFeature === activityFeature && permission.isCreate === true;
    })

    const index = permissions.findIndex(obj => obj.activityFeature === activityFeature);
    if (index > -1) {
        if (permissions[index].isCreate) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function stringExtract(str, beg, end) {
    return str.split(beg).pop().split(end);
}
