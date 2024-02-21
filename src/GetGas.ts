export async function GetGas(transaction) {
  const reciept = await transaction.wait();
  return parseInt(reciept.gasUsed.toString(), 10);
}
