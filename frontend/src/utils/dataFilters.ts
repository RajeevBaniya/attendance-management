type DatePresetFilter = "ALL" | "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS";

const normalizeSearchValue = (value: string) => value.trim().toLowerCase();

const matchesSearch = (value: string, searchTerm: string) => {
  const normalizedSearch = normalizeSearchValue(searchTerm);
  if (!normalizedSearch) {
    return true;
  }

  return value.toLowerCase().includes(normalizedSearch);
};

const matchesStatus = (value: string, selectedStatus: string) => {
  if (selectedStatus === "ALL") {
    return true;
  }

  return value.toUpperCase() === selectedStatus.toUpperCase();
};

const matchesDatePreset = (dateValue: string, preset: DatePresetFilter, now = new Date()) => {
  if (preset === "ALL") {
    return true;
  }

  const targetDate = new Date(dateValue);
  if (Number.isNaN(targetDate.getTime())) {
    return false;
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (preset === "TODAY") {
    return targetDate >= startOfToday;
  }

  const daysBack = preset === "LAST_7_DAYS" ? 7 : 30;
  const lowerBound = new Date(startOfToday);
  lowerBound.setDate(lowerBound.getDate() - daysBack);
  return targetDate >= lowerBound;
};

export { matchesDatePreset, matchesSearch, matchesStatus, normalizeSearchValue };
export type { DatePresetFilter };
