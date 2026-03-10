export async function getPlatformStats() {
  return {
    totalTenants: 0,
    activeTenants: 0,
    trialTenants: 0,
    overdueTenants: 0,
    totalUsers: 0,
    totalWhatsAppInstances: 0,
    connectedInstances: 0,
    totalMessages: 0,
    totalAppointments: 0,
    mrr: 0,
    churnRate: 0
  };
}

export async function getPlatformFinance() {
  return [];
}
