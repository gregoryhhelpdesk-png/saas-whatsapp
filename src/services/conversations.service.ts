export async function getConversations(tenantId?: string) {
  return [];
}

export async function getMessages(conversationId: string, tenantId?: string) {
  return [];
}

export async function sendMessage(conversationId: string, message: any, tenantId?: string) {
  return { success: true };
}
