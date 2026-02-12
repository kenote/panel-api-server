/**
 * 成功请求
 */
export const ERROR_STATUS_NULL = 'Request Success!'
/**
 * 无访问权限
 */
export const ERROR_AUTH_FLAG_ACCESS = '没有访问该页面的权限'
/**
 * 无操作权限
 */
export const ERROR_AUTH_FLAG_OPERATE = '没有操作此项的权限'
/**
 * 禁止越级操作
 */
export const ERROR_BYLOND_LEVEL_OPERATE = '无法对比您等级高或平级的用户或组进行操作'
/**
 * 缺少ID标识
 */
export const ERROR_VALID_IDMARK_NOTEXIST = '缺少ID标识'
/**
 * 用户组不存在
 */
export const ERROR_AUTH_OPERATE_GROUP_NULL = '要操作的用户组不存在'
/**
 * 缺少 Channel 频道配置
 */
export const ERROR_NOT_FOUND_CHANNEL = '没找到 channel 配置'
/**
 * 缺少 API 接口配置
 */
export const ERROR_NOT_FOUND_API = '没找到 api 接口'
/**
 * 缺少密钥
 */
export const ERROR_NOT_FOUND_ACCESSKEY = '没找到 %s 的密钥'
/**
 * 高级管理员操作权限
 */
export const ERROR_ONLY_ADVANCED_ADMIN = '只有高级管理员才能操作'
/**
 * 操作用户不存在
 */
export const ERROR_AUTH_OPERATE_USER_NULL = '要操作的用户不存在'
/**
 * ID标识不存在
 */
export const ERROR_VALID_IDMARK_NULL = '要%s的%s不存在'
/**
 * 无法操作非自己的数据
 */
export const ERROR_DATA_DOESNT_BELONG_YOU = '不能操作不属于您的数据'
/**
 * 自定义错误
 */
export const ERROR_CUSTOMIZE_DATA = '\%s'
/**
 * MD5验签失败
 */
export const ERROR_VALID_SIGNATURE_FAIL = 'MD5验签失败'
/**
 * 缺少配置参数
 */
export const ERROR_MISSING_CONFIG_PARAMETER = '缺少配置参数 %s'
/**
 * 禁止移除创建者
 */
export const ERROR_NOT_REMOVE_CREATOR = '无法移除创建者'
/**
 * 禁止重复添加
 */
export const ERROR_REPEAT_ADDTO = '请不要重复添加%s'
/**
 * 不在白名单中
 */
export const ERROR_NOTIN_WHITELIST = '服务器拒绝了访问，您的IP 不在白名单中'
/**
 * 禁止删除 MASTER 组
 */
export const ERROR_NOT_REMOVE_MASTER = '禁止删除 MASTER 组'
/**
 * 禁止迁移进高级组
 */
export const ERROR_NOT_MIGRATED_ADVANCED = '禁止迁移到高级组'
/**
 * 迁移的组不存在
 */
export const ERROR_MIGRATED_GROUP_NOTEXIST = '迁移的组不存在'
/**
 * Socket 连接超时
 */
export const ERROR_SOCKET_CONNECT_TIMEOUT = 'Socket 连接超时'


/**
 * 上传文件类型
 */
export const ERROR_UPLOAD_FILE_MIMETYPE = '上传文件类型不许可. [%s]'
/**
 * 上传文件最大值
 */
export const ERROR_UPLOAD_FILESIZE_LARGEMAX = '上传文件超过最大值 %s.'
/**
 * 缺少上传文件
 */
export const ERROR_UPLOAD_NOT_FILE = '请选择上传文件!'
/**
 * 上传文件权限
 */
export const ERROR_UPLOAD_TYPE_FLAG = '您没有上传%s的权限'
/**
 * 文件/目录存在
 */
export const ERROR_FILENAME_EXISTS = '%s文件/目录已存在'
/**
 * 文件/目录不存在
 */
export const ERROR_FILENAME_NOTEXISTS = '%s文件/目录不存在'


/**
 * 登录验证
 */
export const ERROR_LOGINVALID_FAIL = '用户名密码错误'
/**
 * 查询用户不存在
 */
export const ERROR_FINDUSER_NOTEXIST = '用户不存在'


/**
 * 用户名为空
 */
export const ERROR_VALID_USERNAME_REQUIRED = '用户名不能为空'
/**
 * 用户名格式错误
 */
export const ERROR_VALID_USERNAME_FORMAT = '用户名格式错误'
/**
 * 用户名被占用
 */
export const ERROR_VALID_USERNAME_UNIQUE = '用户名已占用'
/**
 * 密码为空
 */
export const ERROR_VALID_PASSWORD_REQUIRED = '密码不能为空'
/**
 * 密码格式错误
 */
export const ERROR_VALID_PASSWORD_FORMAT = '密码格式错误'
/**
 * 电子邮箱为空
 */
export const ERROR_VALID_EMAIL_REQUIRED = '电子邮箱不能为空'
/**
 * 电子邮箱格式错误
 */
export const ERROR_VALID_EMAIL_FORMAT = '电子邮箱格式错误'
/**
 * 电子邮箱被占用
 */
export const ERROR_VALID_EMAIL_UNIQUE = '电子邮箱已占用'
/**
 * 手机号为空
 */
export const ERROR_VALID_MOBILE_REQUIRED = '手机号不能为空'
/**
 * 手机号格式错误
 */
export const ERROR_VALID_MOBILE_FORMAT = '手机号格式错误'
/**
 * 手机号被占用
 */
export const ERROR_VALID_MOBILE_UNIQUE = '手机号已占用'
/**
 * 必须多选一
 */
export const ERROR_VALID_CHOOSEONE_MORE = '%s 必须设置一个'
/**
 * 票据不能为空
 */
export const ERROR_VALID_TICKET_REQUIRED = '%s不能为空'
/**
 * 票据不存在
 */
export const ERROR_VALID_TICKET_NULL = '该%s不存在'
/**
 * 票据应用范围
 */
export const ERROR_VALID_TICKET_TYPE = '该%s不能应用于%s'
/**
 * 票据被使用
 */
export const ERROR_VALID_TICKET_USED = '该%s已使用'
/**
 * 票据已过期
 */
export const ERROR_VALID_TICKET_EXPIRED = '该%s已过期'


/**
 * 用户组为空
 */
export const ERROR_VALID_GROUP_REQUIRED = '用户组不能为空'
/**
 * 用户组不存在
 */
export const ERROR_VALID_GROUP_NOTEXIST = '用户组不存在'
/**
 * 自定义数据为空
 */
export const ERROR_VALID_DATE_REQUIRED = '%s不能为空'
/**
 * 自定义数据格式错误
 */
export const ERROR_VALID_DATE_FORMAT = '%s格式错误，非日期格式'
/**
 * 自定义名称为空
 */
export const ERROR_VALID_NAME_REQUIRED = '%s不能为空'
/**
 * 自定义名称格式错误
 */
export const ERROR_VALID_NAME_FORMAT = '%s格式错误，不是正确的%s的格式'


/**
 * 邮箱验证超时
 */
export const ERROR_VERIFY_EMAIL_TIMEOUT = '邮箱验证超时'
/**
 * 邮箱验证失败
 */
export const ERROR_VERIFY_EMAIL_FAILED = '邮箱验证失败'
/**
 * 手机号验证超时
 */
export const ERROR_VERIFY_MOBILE_TIMEOUT = '手机号验证超时'
/**
 * 手机号验证失败
 */
export const ERROR_VERIFY_MOBILE_FAILED = '手机号验证失败'
/**
 * 密钥已验证
 */
export const ERROR_VERIFY_TOKEN_VERIFIED = '该密钥已验证'
/**
 * 禁止连续发送
 */
export const ERROR_SEND_MAILPHONE_STEP = '请不要连续发送'
/**
 * 验证码为空
 */
export const ERROR_VERIFY_CODE_REQUIRED = '验证码不能为空'
/**
 * 验证码超时
 */
export const ERROR_VERIFY_CODE_TIMEOUT = '验证码超时'
/**
 * 验证码错误
 */
export const ERROR_VERIFY_CODE_FAILED = '验证码错误'
/**
 * 缺少身份ID验证
 */
export const ERROR_VERIFY_ID_REQUIRED = '缺少身份验证'
/**
 * 身份ID验证超时
 */
export const ERROR_VERIFY_ID_TIMEOUT = '身份验证超时'
/**
 * 身份ID验证错误
 */
export const ERROR_VERIFY_ID_FAILED = '身份验证错误'
/**
 * 未绑定手机号
 */
export const ERROR_MOBILE_NOT_BIND = '未绑定手机号'