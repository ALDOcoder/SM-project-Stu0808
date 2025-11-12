CREATE TABLE `mpstu`.`Untitled`  (
                                     `id` bigint NOT NULL COMMENT '账号',
                                     `username` varchar(99) NOT NULL COMMENT '姓名',
                                     `sex` varchar(10) NULL COMMENT '性别',
                                     `phone` varchar(11) NULL COMMENT '手机号',
                                     `id_number` varchar(20) NULL COMMENT '身份证号码',
                                     `passoword` varchar(20) NOT NULL COMMENT '密码',
                                     `status` int NOT NULL COMMENT '状态码 1 正常 2 冻结',
                                     `role_id` int NOT NULL COMMENT '角色0管理员 1员工 2用户 ',
                                     `create_time` datetime NOT NULL COMMENT '创建时间',
                                     `update_time` datetime NULL,
                                     `create_user` varchar(10) NOT NULL COMMENT '创建人id',
                                     `update_user` varchar(10) NULL COMMENT '更新人id',
                                     PRIMARY KEY (`id`)
);
# 分类表
-- 分类表
CREATE TABLE categories (
                            id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类唯一标识符，自增主键',
                            name VARCHAR(50) NOT NULL COMMENT '分类名称，如"水果类"、"蔬菜类"',
                            photo VARCHAR(255) DEFAULT NULL COMMENT '分类图片的存储路径',
                            display_order INT NOT NULL DEFAULT 0 COMMENT '分类显示顺序，数值越小越靠前',
                            is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '分类是否激活：1-激活，0-禁用',
                            created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '分类创建时间',
                            updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '分类最后更新时间',

                            PRIMARY KEY (id),
                            INDEX idx_categories_name (name),
                            INDEX idx_categories_display_order (display_order),
                            INDEX idx_categories_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表，存储所有商品分类信息';
-- 商品表
CREATE TABLE products (
                          id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品唯一标识符，自增主键',
                          name VARCHAR(100) NOT NULL COMMENT '商品名称',
                          description TEXT COMMENT '商品详细描述',
                          original_price DECIMAL(10, 2) NOT NULL COMMENT '商品原价',
                          sale_price DECIMAL(10, 2) DEFAULT NULL COMMENT '商品促销价，NULL表示无促销',
                          discount_percentage TINYINT UNSIGNED DEFAULT NULL COMMENT '折扣百分比，NULL表示无折扣',
                          category_id INT UNSIGNED DEFAULT NULL COMMENT '逻辑外键：关联categories表的id，表示商品所属分类',
                          photo VARCHAR(255) DEFAULT NULL COMMENT '商品图片的存储路径',
                          stock_quantity INT NOT NULL DEFAULT 0 COMMENT '商品库存数量',
                          status TINYINT(1) NOT NULL  DEFAULT 0 COMMENT '商品状态：1 可售，2-缺货，0 停售',
                          is_featured TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否特色商品：1-是，0-否',
                          is_best_seller TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否畅销商品：1-是，0-否',
                          is_new TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否新品：1-是，0-否',
                          view_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '商品被浏览次数',
                          created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '商品创建时间',
                          updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '商品最后更新时间',

                          PRIMARY KEY (id),
                          INDEX idx_products_name (name),
                          INDEX idx_products_category_id (category_id),
                          INDEX idx_products_status (status),
                          INDEX idx_products_price_range (original_price, sale_price),
                          INDEX idx_products_discount (discount_percentage),
                          INDEX idx_products_featured (is_featured),
                          INDEX idx_products_best_seller (is_best_seller),
                          INDEX idx_products_new (is_new)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表，存储所有商品信息，使用逻辑外键关联分类';

-- 标签表
CREATE TABLE tags (
                      id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签唯一标识符，自增主键',
                      name VARCHAR(50) NOT NULL COMMENT '标签名称，如"特色商品"、"畅销商品"',
                      display_name VARCHAR(50) NOT NULL COMMENT '标签显示名称，如"特色"、"畅销"',
                      color_code VARCHAR(7) DEFAULT '#000000' COMMENT '标签颜色代码，用于前端显示',
                      is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '标签是否激活：1-激活，0-禁用',
                      created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '标签创建时间',

                      PRIMARY KEY (id),
                      UNIQUE KEY uk_tags_name (name),
                      INDEX idx_tags_display_name (display_name),
                      INDEX idx_tags_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表，存储所有可用标签';

-- 商品标签关联表
CREATE TABLE product_tags (
                              id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联记录唯一标识符，自增主键',
                              product_id INT UNSIGNED NOT NULL COMMENT '逻辑外键：关联products表的id，表示商品',
                              tag_id INT UNSIGNED NOT NULL COMMENT '逻辑外键：关联tags表的id，表示标签',
                              created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '关联创建时间',

                              PRIMARY KEY (id),
                              UNIQUE KEY uk_product_tags (product_id, tag_id),
                              INDEX idx_product_tags_product_id (product_id),
                              INDEX idx_product_tags_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品标签关联表，存储商品与标签的多对多关系';

-- 购物车表
CREATE TABLE cart(
                            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '购物车项唯一标识',
                            user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID（逻辑外键，关联用户表）',
                            product_id BIGINT UNSIGNED NOT NULL COMMENT '商品ID（逻辑外键，关联商品表）',
                            quantity INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '商品数量',
                            price DECIMAL(10, 2) UNSIGNED NOT NULL COMMENT '加入购物车时的商品单价',
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除标志(1:已删除,0:未删除)也叫逻辑删除',

    -- 索引设计
                            INDEX idx_user_id (user_id),
                            INDEX idx_product_id (product_id),
                            UNIQUE INDEX uk_user_product (user_id, product_id) COMMENT '防止同一用户重复添加同一商品'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- 用户地址表
-- 创建用户地址表
CREATE TABLE user_address (
                              id INT PRIMARY KEY AUTO_INCREMENT COMMENT '地址ID',
                              user_id INT NOT NULL COMMENT '用户ID 逻辑外键关联',
                              recipient VARCHAR(50) NOT NULL COMMENT '收货人姓名',
                              phone VARCHAR(20) NOT NULL COMMENT '联系电话',
                              province VARCHAR(50) NOT NULL COMMENT '省份',
                              city VARCHAR(50) NOT NULL COMMENT '城市',
                              district VARCHAR(50) NOT NULL COMMENT '区县',
                              detail VARCHAR(255) NOT NULL COMMENT '详细地址',
                              zip_code VARCHAR(10) NOT NULL COMMENT '邮政编码',
                              is_default TINYINT(1) DEFAULT 0 COMMENT '是否默认地址(0:否,1:是)',
                              address_tag VARCHAR(20) DEFAULT '其他' COMMENT '地址标签(如:家,公司,学校)',
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                              status TINYINT(1) DEFAULT 1 COMMENT '状态(0:删除,1:正常)',

    -- 索引
                              INDEX idx_user_id (user_id),
                              INDEX idx_is_default (is_default),
                              INDEX idx_status (status)

    -- 外键约束(如果用户表存在)
    -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';


-- 创建订单表
CREATE TABLE `order` (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
                         user_id INT NOT NULL COMMENT '用户ID',
                         address_id INT NOT NULL COMMENT '收货地址ID',
                         payment_method ENUM('ALIPAY', 'WECHATPAY', 'BANK_TRANSFER', 'CASH_ON_DELIVERY') NOT NULL COMMENT '支付方式',
                         payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING' COMMENT '支付状态',

    -- 金额相关字段
                         subtotal DECIMAL(10,2) NOT NULL COMMENT '商品小计',
                         shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '配送费',
                         discount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '折扣金额',
                         total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',

    -- 时间相关字段
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                         paid_at TIMESTAMP NULL COMMENT '支付时间',


    -- 索引
                         INDEX idx_user_id (user_id),
                         INDEX idx_order_no (order_no),
                         INDEX idx_created_at (created_at),
                         INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 创建订单详情表
CREATE TABLE order_detail (
                              id INT PRIMARY KEY AUTO_INCREMENT,
                              order_id INT NOT NULL COMMENT '订单ID',
                              product_id INT NOT NULL COMMENT '商品ID',
                              product_name VARCHAR(255) NOT NULL COMMENT '商品名称',
                              product_image VARCHAR(500) COMMENT '商品图片',
                              unit_price DECIMAL(10,2) NOT NULL COMMENT '商品单价',
                              quantity INT NOT NULL COMMENT '购买数量',
                              subtotal DECIMAL(10,2) NOT NULL COMMENT '小计金额(单价*数量)',

    -- 商品快照信息（防止商品信息变更影响订单）
                              product_snapshot JSON COMMENT '商品信息快照',

    -- 时间字段
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    -- 索引
                              INDEX idx_order_id (order_id),
                              INDEX idx_product_id (product_id),

    -- 外键约束
                              FOREIGN KEY (order_id) REFERENCES `order`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单详情表';

-- 添加表注释和列注释（如果MySQL版本支持）
ALTER TABLE `order` COMMENT = '订单表';
ALTER TABLE order_detail COMMENT = '订单详情表';
