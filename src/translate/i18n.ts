import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang = localStorage.getItem("lang") || "en";

const resources = {
  en: {
    translation: {
      theme: "Theme",
      dark_mode: "Dark Mode",
      notifications: "Notifications",
      users: "Users",
      dashboard: "Dashboard",
      documents: "Documents",
      archives: "Archives",
      recycle_bin: "Recycle bin",
      document_types: "Document types",
      categories:"Categories",
      staffs:"Staffs",
      staff_types:"Staff types",
      departments:"Departments",
      buildings:"Buildings",
      rooms: "Rooms",
      roles: "Roles",
      ranks: "Ranks",
      user_logs: "User logs",
    },
  },
  my: {
    translation: {
      theme: "အပြင်အဆင်",
      dark_mode: "အမှောင်မုဒ်",
      notifications: "အသိပေးချက်များ",
      users: "အသုံးပြုသူများ",
      dashboard: "ဒက်ရှ်ဘုတ်",
      documents: "စာရွက်စာတမ်းများ",
      archives: "မော်ကွန်းတိုက်",
      recycle_bin: "အမှိုက်ပုံး",
      document_types: "စာတမ်းအမျိုးအစား",
      categories:"ခေါင်းစဉ်အမျိုးအစားများ",
      staffs: "ဝန်ထမ်းများ",
      staff_types: "ဝန်ထမ်းအမျိုးအစားများ",
      departments: "ဌာနများ",
      buildings: "အဆောက်အဦများ",
      rooms: "အခန်းများ",
      roles: "အလုပ်တာဝန်များ",
      ranks: "ရာထူးအဆင့်များ",
      user_logs: "သုံးစွဲသူမှတ်တမ်းများ",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang, // default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;