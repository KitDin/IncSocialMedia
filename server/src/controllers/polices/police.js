export function setStatus(pushStatus, pushError) {
  return {
    Status: pushStatus,
    Error: pushError,
  };
}
