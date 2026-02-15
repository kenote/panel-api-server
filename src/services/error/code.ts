/**
 * 成功请求
 */
export const ERROR_STATUS_NULL = 0
/**
 * 无访问权限
 */
export const ERROR_AUTH_FLAG_ACCESS = 1001
/**
 * 无操作权限
 */
export const ERROR_AUTH_FLAG_OPERATE = 1002
/**
 * 禁止越级操作
 */
export const ERROR_BYLOND_LEVEL_OPERATE = 1003
/**
 * 缺少ID标识
 */
export const ERROR_VALID_IDMARK_NOTEXIST = 1004
/**
 * 用户组不存在
 */
export const ERROR_AUTH_OPERATE_GROUP_NULL = 1005
/**
 * 缺少 Channel 频道配置
 */
export const ERROR_NOT_FOUND_CHANNEL = 1006
/**
 * 缺少 API 接口配置
 */
export const ERROR_NOT_FOUND_API = 1007
/**
 * 缺少密钥
 */
export const ERROR_NOT_FOUND_ACCESSKEY = 1008
/**
 * 高级管理员操作权限
 */
export const ERROR_ONLY_ADVANCED_ADMIN = 1009
/**
 * 操作用户不存在
 */
export const ERROR_AUTH_OPERATE_USER_NULL = 1010
/**
 * ID标识不存在
 */
export const ERROR_VALID_IDMARK_NULL = 1011
/**
 * 无法操作非自己的数据
 */
export const ERROR_DATA_DOESNT_BELONG_YOU = 1012
/**
 * 自定义错误
 */
export const ERROR_CUSTOMIZE_DATA = 1013
/**
 * MD5验签失败
 */
export const ERROR_VALID_SIGNATURE_FAIL = 1014
/**
 * 缺少配置参数
 */
export const ERROR_MISSING_CONFIG_PARAMETER = 1015
/**
 * 禁止移除创建者
 */
export const ERROR_NOT_REMOVE_CREATOR = 1016
/**
 * 禁止重复添加
 */
export const ERROR_REPEAT_ADDTO = 1017
/**
 * 不在白名单中
 */
export const ERROR_NOTIN_WHITELIST = 1018
/**
 * 禁止删除 MASTER 组
 */
export const ERROR_NOT_REMOVE_MASTER = 1019
/**
 * 禁止迁移进高级组
 */
export const ERROR_NOT_MIGRATED_ADVANCED = 1020
/**
 * 迁移的组不存在
 */
export const ERROR_MIGRATED_GROUP_NOTEXIST = 1021
/**
 * Socket 连接超时
 */
export const ERROR_SOCKET_CONNECT_TIMEOUT = 1022

/**
 * 上传文件类型
 */
export const ERROR_UPLOAD_FILE_MIMETYPE = 1101
/**
 * 上传文件最大值
 */
export const ERROR_UPLOAD_FILESIZE_LARGEMAX = 1102
/**
 * 缺少上传文件
 */
export const ERROR_UPLOAD_NOT_FILE = 1103
/**
 * 上传文件权限
 */
export const ERROR_UPLOAD_TYPE_FLAG = 1104
/**
 * 文件/目录存在
 */
export const ERROR_FILENAME_EXISTS = 1105
/**
 * 文件/目录不存在
 */
export const ERROR_FILENAME_NOTEXISTS = 1106
/**
 * 不是有效的ZIP文件
 */
export const ERROR_NOT_ZIPFILE = 1107


/**
 * 登录验证
 */
export const ERROR_LOGINVALID_FAIL = 1201
/**
 * 查询用户不存在
 */
export const ERROR_FINDUSER_NOTEXIST = 1202


/**
 * 用户名为空
 */
export const ERROR_VALID_USERNAME_REQUIRED = 1401
/**
 * 用户名格式错误
 */
export const ERROR_VALID_USERNAME_FORMAT = 1402
/**
 * 用户名被占用
 */
export const ERROR_VALID_USERNAME_UNIQUE = 1403
/**
 * 密码为空
 */
export const ERROR_VALID_PASSWORD_REQUIRED = 1404
/**
 * 密码格式错误
 */
export const ERROR_VALID_PASSWORD_FORMAT = 1405
/**
 * 电子邮箱为空
 */
export const ERROR_VALID_EMAIL_REQUIRED = 1406
/**
 * 电子邮箱格式错误
 */
export const ERROR_VALID_EMAIL_FORMAT = 1407
/**
 * 电子邮箱被占用
 */
export const ERROR_VALID_EMAIL_UNIQUE = 1408
/**
 * 手机号为空
 */
export const ERROR_VALID_MOBILE_REQUIRED = 1409
/**
 * 手机号格式错误
 */
export const ERROR_VALID_MOBILE_FORMAT = 1410
/**
 * 手机号被占用
 */
export const ERROR_VALID_MOBILE_UNIQUE = 1411
/**
 * 必须多选一
 */
export const ERROR_VALID_CHOOSEONE_MORE = 1412
/**
 * 票据不能为空
 */
export const ERROR_VALID_TICKET_REQUIRED = 1413
/**
 * 票据不存在
 */
export const ERROR_VALID_TICKET_NULL = 1414
/**
 * 票据应用范围
 */
export const ERROR_VALID_TICKET_TYPE = 1415
/**
 * 票据被使用
 */
export const ERROR_VALID_TICKET_USED = 1416
/**
 * 票据已过期
 */
export const ERROR_VALID_TICKET_EXPIRED = 1417


/**
 * 用户组为空
 */
export const ERROR_VALID_GROUP_REQUIRED = 1418
/**
 * 用户组不存在
 */
export const ERROR_VALID_GROUP_NOTEXIST = 1419
/**
 * 自定义数据为空
 */
export const ERROR_VALID_DATE_REQUIRED = 1420
/**
 * 自定义数据格式错误
 */
export const ERROR_VALID_DATE_FORMAT = 1421
/**
 * 自定义名称为空
 */
export const ERROR_VALID_NAME_REQUIRED = 1422
/**
 * 自定义名称格式错误
 */
export const ERROR_VALID_NAME_FORMAT = 1423


/**
 * 邮箱验证超时
 */
export const ERROR_VERIFY_EMAIL_TIMEOUT = 1451
/**
 * 邮箱验证失败
 */
export const ERROR_VERIFY_EMAIL_FAILED = 1452
/**
 * 手机号验证超时
 */
export const ERROR_VERIFY_MOBILE_TIMEOUT = 1453
/**
 * 手机号验证失败
 */
export const ERROR_VERIFY_MOBILE_FAILED = 1454
/**
 * 密钥已验证
 */
export const ERROR_VERIFY_TOKEN_VERIFIED = 1455
/**
 * 禁止连续发送
 */
export const ERROR_SEND_MAILPHONE_STEP = 1456
/**
 * 验证码为空
 */
export const ERROR_VERIFY_CODE_REQUIRED = 1457
/**
 * 验证码超时
 */
export const ERROR_VERIFY_CODE_TIMEOUT = 1458
/**
 * 验证码错误
 */
export const ERROR_VERIFY_CODE_FAILED = 1459
/**
 * 缺少身份ID验证
 */
export const ERROR_VERIFY_ID_REQUIRED = 1460
/**
 * 身份ID验证超时
 */
export const ERROR_VERIFY_ID_TIMEOUT = 1461
/**
 * 身份ID验证错误
 */
export const ERROR_VERIFY_ID_FAILED = 1462
/**
 * 未绑定手机号
 */
export const ERROR_MOBILE_NOT_BIND = 1463