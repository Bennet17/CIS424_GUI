//this page declares all of our routes as constants, so should any route name need to be changed,
//it can easily be done so here, and all affecting pages will be updated

const routes = {
  home: "/Home",
  selectstore: "/SelectStore",
  openday: "/OpenDay",
  closeday: "/CloseDay",
  security: "/Security",
  usermanagement: "/Security/UserManagement",
  posmanagement: "/Security/POSManagement",
  storemanagement: "/Security/StoreManagement",
  fundstransfer: "/TransferFunds",
  cashmanager: "/CashManager",
  safeaudit: "/CashManager/SafeAudit",
  varianceaudit: "/CashManager/VarianceAudit",
  deposithistory: "/CashManager/DepositHistory",
  signout: "/",
  forgotpassword: "/forgotPassword",

  //add more here
};

export default routes;
