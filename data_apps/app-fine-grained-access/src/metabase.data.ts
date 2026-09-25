const models = {
  commandGrantModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 3,
        name: "Create",
        type: "implicit",
        parameters: [
          {
            slug: "schema_name",
            displayName: "Schema Name",
            jsType: "string",
            required: true
          },
          {
            slug: "table_name",
            displayName: "Table Name",
            jsType: "string",
            required: true
          },
          {
            slug: "role_name",
            displayName: "Role Name",
            jsType: "string",
            required: true
          },
          {
            slug: "privilege",
            displayName: "Privilege",
            jsType: "string",
            required: true
          },
          {
            slug: "should_grant",
            displayName: "Should Grant",
            jsType: "boolean",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "BfouhHTLIbUJzIJjd4RgP",
        implicitKind: "row/create"
      },
      delete: {
        kind: "action",
        key: "delete",
        id: 1,
        name: "Delete",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          }
        ],
        entityId: "UH54AE6xXdh-yHn9DUsU5",
        implicitKind: "row/delete"
      },
      update: {
        kind: "action",
        key: "update",
        id: 2,
        name: "Update",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          },
          {
            slug: "schema_name",
            displayName: "Schema Name",
            jsType: "string",
            required: true
          },
          {
            slug: "table_name",
            displayName: "Table Name",
            jsType: "string",
            required: true
          },
          {
            slug: "role_name",
            displayName: "Role Name",
            jsType: "string",
            required: true
          },
          {
            slug: "privilege",
            displayName: "Privilege",
            jsType: "string",
            required: true
          },
          {
            slug: "should_grant",
            displayName: "Should Grant",
            jsType: "boolean",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "zMjEpw19afIacbGPbbQph",
        implicitKind: "row/update"
      }
    }
  },
  commandMembershipModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 6,
        name: "Create",
        type: "implicit",
        parameters: [
          {
            slug: "user_name",
            displayName: "User Name",
            jsType: "string",
            required: true
          },
          {
            slug: "role_name",
            displayName: "Role Name",
            jsType: "string",
            required: true
          },
          {
            slug: "action",
            displayName: "Action",
            jsType: "string",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "sGa9uI4_HsNpRaA0m9EMU",
        implicitKind: "row/create"
      },
      delete: {
        kind: "action",
        key: "delete",
        id: 4,
        name: "Delete",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          }
        ],
        entityId: "hR8KHpEkbkCDDzDp4rfmp",
        implicitKind: "row/delete"
      },
      update: {
        kind: "action",
        key: "update",
        id: 5,
        name: "Update",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          },
          {
            slug: "user_name",
            displayName: "User Name",
            jsType: "string",
            required: true
          },
          {
            slug: "role_name",
            displayName: "Role Name",
            jsType: "string",
            required: true
          },
          {
            slug: "action",
            displayName: "Action",
            jsType: "string",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "ygCA7_BLDjGVT89T2Lcj3",
        implicitKind: "row/update"
      }
    }
  },
  commandRoleModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 9,
        name: "Create",
        type: "implicit",
        parameters: [
          {
            slug: "role_name",
            displayName: "Role Name",
            jsType: "string",
            required: true
          },
          {
            slug: "action",
            displayName: "Action",
            jsType: "string",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "-6AZqbWd_by3K9mc17pxd",
        implicitKind: "row/create"
      },
      delete: {
        kind: "action",
        key: "delete",
        id: 7,
        name: "Delete",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          }
        ],
        entityId: "DR-Z64WlXcJxccqNDREal",
        implicitKind: "row/delete"
      },
      update: {
        kind: "action",
        key: "update",
        id: 8,
        name: "Update",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          },
          {
            slug: "role_name",
            displayName: "Role Name",
            jsType: "string",
            required: true
          },
          {
            slug: "action",
            displayName: "Action",
            jsType: "string",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "d7TCYu0un_tIoq4cxjYKI",
        implicitKind: "row/update"
      }
    }
  },
  commandUserModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 12,
        name: "Create",
        type: "implicit",
        parameters: [
          {
            slug: "user_name",
            displayName: "User Name",
            jsType: "string",
            required: true
          },
          {
            slug: "password",
            displayName: "Password",
            jsType: "string"
          },
          {
            slug: "action",
            displayName: "Action",
            jsType: "string",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "6AT78KorEDxPk6QNluyia",
        implicitKind: "row/create"
      },
      delete: {
        kind: "action",
        key: "delete",
        id: 10,
        name: "Delete",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          }
        ],
        entityId: "xCjQwXdtlJ4sP3ekkjlqw",
        implicitKind: "row/delete"
      },
      update: {
        kind: "action",
        key: "update",
        id: 11,
        name: "Update",
        type: "implicit",
        parameters: [
          {
            slug: "id",
            displayName: "ID",
            jsType: "number",
            required: true
          },
          {
            slug: "user_name",
            displayName: "User Name",
            jsType: "string",
            required: true
          },
          {
            slug: "password",
            displayName: "Password",
            jsType: "string"
          },
          {
            slug: "action",
            displayName: "Action",
            jsType: "string",
            required: true
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "R1lx5aiF2B-DyL3AErmyV",
        implicitKind: "row/update"
      }
    }
  }
} as const;

const tables = {
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: command_grant
  commandGrant: {
    type: "table",
    id: 220,
    name: "Command Grant",
    fields: {
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "command_grant",
        jsType: "number",
        fieldId: 2205,
        tableId: 220,
        baseType: "type/BigInteger"
      },
      // Display name: Privilege
      privilege: {
        type: "column",
        name: "privilege",
        sourceName: "command_grant",
        jsType: "string",
        fieldId: 2209,
        tableId: 220,
        baseType: "type/Text"
      },
      // Display name: Requested At
      requestedAt: {
        type: "column",
        name: "requested_at",
        sourceName: "command_grant",
        jsType: "Date",
        fieldId: 2211,
        tableId: 220,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Role Name
      roleName: {
        type: "column",
        name: "role_name",
        sourceName: "command_grant",
        jsType: "string",
        fieldId: 2208,
        tableId: 220,
        baseType: "type/Text"
      },
      // Display name: Schema Name
      schemaName: {
        type: "column",
        name: "schema_name",
        sourceName: "command_grant",
        jsType: "string",
        fieldId: 2206,
        tableId: 220,
        baseType: "type/Text"
      },
      // Display name: Should Grant
      shouldGrant: {
        type: "column",
        name: "should_grant",
        sourceName: "command_grant",
        jsType: "boolean",
        fieldId: 2210,
        tableId: 220,
        baseType: "type/Boolean"
      },
      // Display name: Table Name
      tableName: {
        type: "column",
        name: "table_name",
        sourceName: "command_grant",
        jsType: "string",
        fieldId: 2207,
        tableId: 220,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: command_membership
  commandMembership: {
    type: "table",
    id: 221,
    name: "Command Membership",
    fields: {
      // Display name: Action
      action: {
        type: "column",
        name: "action",
        sourceName: "command_membership",
        jsType: "string",
        fieldId: 2215,
        tableId: 221,
        baseType: "type/Text"
      },
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "command_membership",
        jsType: "number",
        fieldId: 2212,
        tableId: 221,
        baseType: "type/BigInteger"
      },
      // Display name: Requested At
      requestedAt: {
        type: "column",
        name: "requested_at",
        sourceName: "command_membership",
        jsType: "Date",
        fieldId: 2216,
        tableId: 221,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Role Name
      roleName: {
        type: "column",
        name: "role_name",
        sourceName: "command_membership",
        jsType: "string",
        fieldId: 2214,
        tableId: 221,
        baseType: "type/Text"
      },
      // Display name: User Name
      userName: {
        type: "column",
        name: "user_name",
        sourceName: "command_membership",
        jsType: "string",
        fieldId: 2213,
        tableId: 221,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: command_role
  commandRole: {
    type: "table",
    id: 222,
    name: "Command Role",
    fields: {
      // Display name: Action
      // Semantic type: type/Category
      action: {
        type: "column",
        name: "action",
        sourceName: "command_role",
        jsType: "string",
        fieldId: 2219,
        tableId: 222,
        baseType: "type/Text"
      },
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "command_role",
        jsType: "number",
        fieldId: 2217,
        tableId: 222,
        baseType: "type/BigInteger"
      },
      // Display name: Requested At
      requestedAt: {
        type: "column",
        name: "requested_at",
        sourceName: "command_role",
        jsType: "Date",
        fieldId: 2220,
        tableId: 222,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Role Name
      // Semantic type: type/Category
      roleName: {
        type: "column",
        name: "role_name",
        sourceName: "command_role",
        jsType: "string",
        fieldId: 2218,
        tableId: 222,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: command_user
  commandUser: {
    type: "table",
    id: 223,
    name: "Command User",
    fields: {
      // Display name: Action
      action: {
        type: "column",
        name: "action",
        sourceName: "command_user",
        jsType: "string",
        fieldId: 2224,
        tableId: 223,
        baseType: "type/Text"
      },
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "command_user",
        jsType: "number",
        fieldId: 2221,
        tableId: 223,
        baseType: "type/BigInteger"
      },
      // Display name: Password
      password: {
        type: "column",
        name: "password",
        sourceName: "command_user",
        jsType: "string",
        fieldId: 2223,
        tableId: 223,
        baseType: "type/Text"
      },
      // Display name: Requested At
      requestedAt: {
        type: "column",
        name: "requested_at",
        sourceName: "command_user",
        jsType: "Date",
        fieldId: 2225,
        tableId: 223,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: User Name
      userName: {
        type: "column",
        name: "user_name",
        sourceName: "command_user",
        jsType: "string",
        fieldId: 2222,
        tableId: 223,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: sales
  customers: {
    type: "table",
    id: 15,
    name: "Customers",
    fields: {
      // Display name: Created At
      // Semantic type: type/CreationTimestamp
      createdAt: {
        type: "column",
        name: "created_at",
        sourceName: "customers",
        jsType: "Date",
        fieldId: 98,
        tableId: 15,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Email
      // Semantic type: type/Email
      email: {
        type: "column",
        name: "email",
        sourceName: "customers",
        jsType: "string",
        fieldId: 96,
        tableId: 15,
        baseType: "type/Text"
      },
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "customers",
        jsType: "number",
        fieldId: 94,
        tableId: 15,
        baseType: "type/Integer"
      },
      // Display name: Name
      // Semantic type: type/Name
      name: {
        type: "column",
        name: "name",
        sourceName: "customers",
        jsType: "string",
        fieldId: 95,
        tableId: 15,
        baseType: "type/Text"
      },
      // Display name: Region
      // Semantic type: type/Category
      region: {
        type: "column",
        name: "region",
        sourceName: "customers",
        jsType: "string",
        fieldId: 97,
        tableId: 15,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: daily_metrics
  dailyMetrics: {
    type: "table",
    id: 9,
    name: "Daily Metrics",
    fields: {
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "daily_metrics",
        jsType: "number",
        fieldId: 72,
        tableId: 9,
        baseType: "type/Integer"
      },
      // Display name: Metric Date
      metricDate: {
        type: "column",
        name: "metric_date",
        sourceName: "daily_metrics",
        jsType: "Date",
        fieldId: 73,
        tableId: 9,
        baseType: "type/Date"
      },
      // Display name: Metric Name
      // Semantic type: type/Category
      metricName: {
        type: "column",
        name: "metric_name",
        sourceName: "daily_metrics",
        jsType: "string",
        fieldId: 74,
        tableId: 9,
        baseType: "type/Text"
      },
      // Display name: Metric Value
      metricValue: {
        type: "column",
        name: "metric_value",
        sourceName: "daily_metrics",
        jsType: "number",
        fieldId: 75,
        tableId: 9,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  events: {
    type: "table",
    id: 10,
    name: "Events",
    fields: {
      // Display name: Event Name
      // Semantic type: type/Category
      eventName: {
        type: "column",
        name: "event_name",
        sourceName: "events",
        jsType: "string",
        fieldId: 78,
        tableId: 10,
        baseType: "type/Text"
      },
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "events",
        jsType: "number",
        fieldId: 76,
        tableId: 10,
        baseType: "type/Integer"
      },
      // Display name: Occurred At
      occurredAt: {
        type: "column",
        name: "occurred_at",
        sourceName: "events",
        jsType: "Date",
        fieldId: 80,
        tableId: 10,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Properties
      // Semantic type: type/SerializedJSON
      properties: {
        type: "column",
        name: "properties",
        sourceName: "events",
        jsType: "unknown",
        fieldId: 81,
        tableId: 10,
        baseType: "type/JSON"
      },
      // Display name: Properties → N
      "properties→N": {
        type: "column",
        name: "properties → n",
        sourceName: "events",
        jsType: "number",
        fieldId: 77,
        tableId: 10,
        baseType: "type/Integer"
      },
      // Display name: User ID
      userId: {
        type: "column",
        name: "user_id",
        sourceName: "events",
        jsType: "number",
        fieldId: 79,
        tableId: 10,
        baseType: "type/Integer"
      }
    }
  },
  // Database: sample_dwh
  // Schema: sales
  // Table: order_items
  orderItems: {
    type: "table",
    id: 16,
    name: "Order Items",
    fields: {
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "order_items",
        jsType: "number",
        fieldId: 99,
        tableId: 16,
        baseType: "type/Integer"
      },
      // Display name: Order ID
      // Semantic type: type/FK
      orderId: {
        type: "column",
        name: "order_id",
        sourceName: "order_items",
        jsType: "number",
        fieldId: 100,
        tableId: 16,
        baseType: "type/Integer"
      },
      // Display name: Quantity
      // Semantic type: type/Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "order_items",
        jsType: "number",
        fieldId: 102,
        tableId: 16,
        baseType: "type/Integer"
      },
      // Display name: Sku
      // Semantic type: type/Category
      sku: {
        type: "column",
        name: "sku",
        sourceName: "order_items",
        jsType: "string",
        fieldId: 101,
        tableId: 16,
        baseType: "type/Text"
      },
      // Display name: Unit Price
      unitPrice: {
        type: "column",
        name: "unit_price",
        sourceName: "order_items",
        jsType: "number",
        fieldId: 103,
        tableId: 16,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: sales
  orders: {
    type: "table",
    id: 17,
    name: "Orders",
    fields: {
      // Display name: Customer ID
      // Semantic type: type/FK
      customerId: {
        type: "column",
        name: "customer_id",
        sourceName: "orders",
        jsType: "number",
        fieldId: 105,
        tableId: 17,
        baseType: "type/Integer"
      },
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "orders",
        jsType: "number",
        fieldId: 104,
        tableId: 17,
        baseType: "type/Integer"
      },
      // Display name: Order Total
      orderTotal: {
        type: "column",
        name: "order_total",
        sourceName: "orders",
        jsType: "number",
        fieldId: 106,
        tableId: 17,
        baseType: "type/Decimal"
      },
      // Display name: Ordered At
      orderedAt: {
        type: "column",
        name: "ordered_at",
        sourceName: "orders",
        jsType: "Date",
        fieldId: 108,
        tableId: 17,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Status
      // Semantic type: type/Category
      status: {
        type: "column",
        name: "status",
        sourceName: "orders",
        jsType: "string",
        fieldId: 107,
        tableId: 17,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: v_grants
  vGrants: {
    type: "table",
    id: 224,
    name: "V Grants",
    fields: {
      // Display name: Privilege
      // Semantic type: type/Category
      privilege: {
        type: "column",
        name: "privilege",
        sourceName: "v_grants",
        jsType: "string",
        fieldId: 2229,
        tableId: 224,
        baseType: "type/Text"
      },
      // Display name: Role Name
      // Semantic type: type/Category
      roleName: {
        type: "column",
        name: "role_name",
        sourceName: "v_grants",
        jsType: "string",
        fieldId: 2228,
        tableId: 224,
        baseType: "type/Text"
      },
      // Display name: Schema Name
      // Semantic type: type/Category
      schemaName: {
        type: "column",
        name: "schema_name",
        sourceName: "v_grants",
        jsType: "string",
        fieldId: 2226,
        tableId: 224,
        baseType: "type/Text"
      },
      // Display name: Table Name
      // Semantic type: type/Category
      tableName: {
        type: "column",
        name: "table_name",
        sourceName: "v_grants",
        jsType: "string",
        fieldId: 2227,
        tableId: 224,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: v_memberships
  vMemberships: {
    type: "table",
    id: 225,
    name: "V Memberships",
    fields: {
      // Display name: Member Name
      // Semantic type: type/Category
      memberName: {
        type: "column",
        name: "member_name",
        sourceName: "v_memberships",
        jsType: "string",
        fieldId: 2230,
        tableId: 225,
        baseType: "type/Text"
      },
      // Display name: Role Name
      // Semantic type: type/Category
      roleName: {
        type: "column",
        name: "role_name",
        sourceName: "v_memberships",
        jsType: "string",
        fieldId: 2231,
        tableId: 225,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: v_roles
  vRoles: {
    type: "table",
    id: 226,
    name: "V Roles",
    fields: {
      // Display name: Role Kind
      // Semantic type: type/Category
      roleKind: {
        type: "column",
        name: "role_kind",
        sourceName: "v_roles",
        jsType: "string",
        fieldId: 2233,
        tableId: 226,
        baseType: "type/Text"
      },
      // Display name: Role Name
      // Semantic type: type/Category
      roleName: {
        type: "column",
        name: "role_name",
        sourceName: "v_roles",
        jsType: "string",
        fieldId: 2232,
        tableId: 226,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: v_schema_tree
  vSchemaTree: {
    type: "table",
    id: 227,
    name: "V Schema Tree",
    fields: {
      // Display name: Database Name
      // Semantic type: type/Category
      databaseName: {
        type: "column",
        name: "database_name",
        sourceName: "v_schema_tree",
        jsType: "string",
        fieldId: 2236,
        tableId: 227,
        baseType: "type/Text"
      },
      // Display name: Schema Name
      // Semantic type: type/Category
      schemaName: {
        type: "column",
        name: "schema_name",
        sourceName: "v_schema_tree",
        jsType: "string",
        fieldId: 2234,
        tableId: 227,
        baseType: "type/Text"
      },
      // Display name: Table Name
      // Semantic type: type/Category
      tableName: {
        type: "column",
        name: "table_name",
        sourceName: "v_schema_tree",
        jsType: "string",
        fieldId: 2235,
        tableId: 227,
        baseType: "type/Text"
      }
    }
  }
} as const;

const metrics = { } as const;

const schema = {
  schemaVersion: 2,
  generatedAt: "2026-09-25T01:58:48.759389820Z",
  metabase: {
    instanceUrl: "http://localhost:3000"
  },
  models: models,
  tables: tables,
  metrics: metrics
} as const;

export default schema;
