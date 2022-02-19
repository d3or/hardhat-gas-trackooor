export async function GetGas(transaction) {
  const reciept = await transaction.wait();
  return reciept.gasUsed.toNumber();
}
