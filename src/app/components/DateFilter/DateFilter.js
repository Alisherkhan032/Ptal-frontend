import moment from "moment";

export const filterByDate = (data, dayFilter, dateField = 'createdAt') => {
    if (dayFilter === "all") return data;
    
    const now = moment();
    return data.filter((item) => {
      const itemDate = moment(item[dateField]);
      switch (dayFilter) {
        case "7days":
          return itemDate.isAfter(now.clone().subtract(7, "days"));
        case "14days":
          return itemDate.isAfter(now.clone().subtract(14, "days"));
        case "30days":
          return itemDate.isAfter(now.clone().subtract(30, "days"));
        default:
          return true;
      }
    });
  };