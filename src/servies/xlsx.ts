import xlsx from 'xlsx'

/**
 * 转xlsx文档
 * @param data 
 * @param filename 
 */
export function json2Xlsx (data: Record<string, any>[], filename: string) {
  let workbook = xlsx.utils.book_new()
  let worksheet = xlsx.utils.json_to_sheet(data)
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  xlsx.writeFile(workbook, filename)
}