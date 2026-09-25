const models = {
  commandBatchModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 16,
        name: "Create",
        type: "implicit",
        parameters: [
          {
            slug: "changes",
            displayName: "Changes",
            jsType: "string",
            required: true
          },
          {
            slug: "status",
            displayName: "Status",
            jsType: "string"
          },
          {
            slug: "results",
            displayName: "Results",
            jsType: "string"
          },
          {
            slug: "error_message",
            displayName: "Error Message",
            jsType: "string"
          },
          {
            slug: "requested_at",
            displayName: "Requested At",
            jsType: "Date"
          }
        ],
        entityId: "rpm5NIKBSgMEG6yxCktuV",
        implicitKind: "row/create"
      }
    }
  },
  commandGrantModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 13,
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
        entityId: "9r2sPyePyUXGApNNLbDox",
        implicitKind: "row/create"
      }
    }
  },
  commandMembershipModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 14,
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
        entityId: "69-rIzqsLHlB3cfat7Wtc",
        implicitKind: "row/create"
      }
    }
  },
  commandRoleModel: {
    actions: {
      create: {
        kind: "action",
        key: "create",
        id: 15,
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
        entityId: "UafDpzW5fcJ0t4gYSvs7c",
        implicitKind: "row/create"
      }
    }
  }
} as const;

const tables = {
  // Database: sample_dwh
  // Schema: public
  // Table: app_settings
  appSettings: {
    type: "table",
    id: 264,
    name: "App Settings",
    fields: {
      // Display name: Setting ID
      settingId: {
        type: "column",
        name: "setting_id",
        sourceName: "app_settings",
        jsType: "number",
        fieldId: 2237,
        tableId: 264,
        baseType: "type/BigInteger"
      },
      // Display name: Setting Key
      settingKey: {
        type: "column",
        name: "setting_key",
        sourceName: "app_settings",
        jsType: "number",
        fieldId: 2238,
        tableId: 264,
        baseType: "type/BigInteger"
      },
      // Display name: Setting Value
      settingValue: {
        type: "column",
        name: "setting_value",
        sourceName: "app_settings",
        jsType: "number",
        fieldId: 2239,
        tableId: 264,
        baseType: "type/Decimal"
      },
      // Display name: Updated At
      updatedAt: {
        type: "column",
        name: "updated_at",
        sourceName: "app_settings",
        jsType: "Date",
        fieldId: 2240,
        tableId: 264,
        baseType: "type/DateTimeWithLocalTZ"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: audit_log
  auditLog: {
    type: "table",
    id: 265,
    name: "Audit Log",
    fields: {
      // Display name: Action
      action: {
        type: "column",
        name: "action",
        sourceName: "audit_log",
        jsType: "string",
        fieldId: 2243,
        tableId: 265,
        baseType: "type/Text"
      },
      // Display name: Actor Email
      actorEmail: {
        type: "column",
        name: "actor_email",
        sourceName: "audit_log",
        jsType: "string",
        fieldId: 2242,
        tableId: 265,
        baseType: "type/Text"
      },
      // Display name: Created At
      createdAt: {
        type: "column",
        name: "created_at",
        sourceName: "audit_log",
        jsType: "Date",
        fieldId: 2246,
        tableId: 265,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Entity ID
      entityId: {
        type: "column",
        name: "entity_id",
        sourceName: "audit_log",
        jsType: "number",
        fieldId: 2245,
        tableId: 265,
        baseType: "type/BigInteger"
      },
      // Display name: Entity Type
      entityType: {
        type: "column",
        name: "entity_type",
        sourceName: "audit_log",
        jsType: "string",
        fieldId: 2244,
        tableId: 265,
        baseType: "type/Text"
      },
      // Display name: Log ID
      logId: {
        type: "column",
        name: "log_id",
        sourceName: "audit_log",
        jsType: "number",
        fieldId: 2241,
        tableId: 265,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: command_batch
  commandBatch: {
    type: "table",
    id: 332,
    name: "Command Batch",
    fields: {
      // Display name: Changes
      // Semantic type: type/SerializedJSON
      changes: {
        type: "column",
        name: "changes",
        sourceName: "command_batch",
        jsType: "string",
        fieldId: 2953,
        tableId: 332,
        baseType: "type/Text"
      },
      // Display name: Error Message
      // Semantic type: type/Category
      errorMessage: {
        type: "column",
        name: "error_message",
        sourceName: "command_batch",
        jsType: "string",
        fieldId: 2956,
        tableId: 332,
        baseType: "type/Text"
      },
      // Display name: ID
      // Semantic type: type/PK
      id: {
        type: "column",
        name: "id",
        sourceName: "command_batch",
        jsType: "number",
        fieldId: 2952,
        tableId: 332,
        baseType: "type/BigInteger"
      },
      // Display name: Requested At
      requestedAt: {
        type: "column",
        name: "requested_at",
        sourceName: "command_batch",
        jsType: "Date",
        fieldId: 2957,
        tableId: 332,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Results
      // Semantic type: type/SerializedJSON
      results: {
        type: "column",
        name: "results",
        sourceName: "command_batch",
        jsType: "string",
        fieldId: 2955,
        tableId: 332,
        baseType: "type/Text"
      },
      // Display name: Status
      // Semantic type: type/Category
      status: {
        type: "column",
        name: "status",
        sourceName: "command_batch",
        jsType: "string",
        fieldId: 2954,
        tableId: 332,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_account
  dimAccount: {
    type: "table",
    id: 228,
    name: "Dim Account",
    fields: {
      // Display name: Account Code
      accountCode: {
        type: "column",
        name: "account_code",
        sourceName: "dim_account",
        jsType: "string",
        fieldId: 2283,
        tableId: 228,
        baseType: "type/Text"
      },
      // Display name: Account Key
      accountKey: {
        type: "column",
        name: "account_key",
        sourceName: "dim_account",
        jsType: "number",
        fieldId: 2282,
        tableId: 228,
        baseType: "type/BigInteger"
      },
      // Display name: Account Name
      accountName: {
        type: "column",
        name: "account_name",
        sourceName: "dim_account",
        jsType: "string",
        fieldId: 2284,
        tableId: 228,
        baseType: "type/Text"
      },
      // Display name: Account Type
      accountType: {
        type: "column",
        name: "account_type",
        sourceName: "dim_account",
        jsType: "string",
        fieldId: 2285,
        tableId: 228,
        baseType: "type/Text"
      },
      // Display name: Parent Account Key
      parentAccountKey: {
        type: "column",
        name: "parent_account_key",
        sourceName: "dim_account",
        jsType: "number",
        fieldId: 2286,
        tableId: 228,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_campaign
  dimCampaign: {
    type: "table",
    id: 229,
    name: "Dim Campaign",
    fields: {
      // Display name: Budget Amount
      budgetAmount: {
        type: "column",
        name: "budget_amount",
        sourceName: "dim_campaign",
        jsType: "number",
        fieldId: 2293,
        tableId: 229,
        baseType: "type/Decimal"
      },
      // Display name: Campaign Key
      campaignKey: {
        type: "column",
        name: "campaign_key",
        sourceName: "dim_campaign",
        jsType: "number",
        fieldId: 2287,
        tableId: 229,
        baseType: "type/BigInteger"
      },
      // Display name: Campaign Name
      campaignName: {
        type: "column",
        name: "campaign_name",
        sourceName: "dim_campaign",
        jsType: "string",
        fieldId: 2288,
        tableId: 229,
        baseType: "type/Text"
      },
      // Display name: Channel Key
      channelKey: {
        type: "column",
        name: "channel_key",
        sourceName: "dim_campaign",
        jsType: "number",
        fieldId: 2289,
        tableId: 229,
        baseType: "type/BigInteger"
      },
      // Display name: End Date
      endDate: {
        type: "column",
        name: "end_date",
        sourceName: "dim_campaign",
        jsType: "Date",
        fieldId: 2292,
        tableId: 229,
        baseType: "type/Date"
      },
      // Display name: Objective Name
      objectiveName: {
        type: "column",
        name: "objective_name",
        sourceName: "dim_campaign",
        jsType: "string",
        fieldId: 2290,
        tableId: 229,
        baseType: "type/Text"
      },
      // Display name: Start Date
      startDate: {
        type: "column",
        name: "start_date",
        sourceName: "dim_campaign",
        jsType: "Date",
        fieldId: 2291,
        tableId: 229,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_channel
  dimChannel: {
    type: "table",
    id: 230,
    name: "Dim Channel",
    fields: {
      // Display name: Channel Group
      // Semantic type: type/Source
      channelGroup: {
        type: "column",
        name: "channel_group",
        sourceName: "dim_channel",
        jsType: "string",
        fieldId: 2296,
        tableId: 230,
        baseType: "type/Text"
      },
      // Display name: Channel Key
      // Semantic type: type/Source
      channelKey: {
        type: "column",
        name: "channel_key",
        sourceName: "dim_channel",
        jsType: "number",
        fieldId: 2294,
        tableId: 230,
        baseType: "type/BigInteger"
      },
      // Display name: Channel Name
      // Semantic type: type/Source
      channelName: {
        type: "column",
        name: "channel_name",
        sourceName: "dim_channel",
        jsType: "string",
        fieldId: 2295,
        tableId: 230,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_cost_center
  dimCostCenter: {
    type: "table",
    id: 231,
    name: "Dim Cost Center",
    fields: {
      // Display name: Cost Center Code
      costCenterCode: {
        type: "column",
        name: "cost_center_code",
        sourceName: "dim_cost_center",
        jsType: "string",
        fieldId: 2298,
        tableId: 231,
        baseType: "type/Text"
      },
      // Display name: Cost Center Key
      costCenterKey: {
        type: "column",
        name: "cost_center_key",
        sourceName: "dim_cost_center",
        jsType: "number",
        fieldId: 2297,
        tableId: 231,
        baseType: "type/BigInteger"
      },
      // Display name: Cost Center Name
      costCenterName: {
        type: "column",
        name: "cost_center_name",
        sourceName: "dim_cost_center",
        jsType: "string",
        fieldId: 2299,
        tableId: 231,
        baseType: "type/Text"
      },
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "dim_cost_center",
        jsType: "number",
        fieldId: 2300,
        tableId: 231,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_currency
  dimCurrency: {
    type: "table",
    id: 232,
    name: "Dim Currency",
    fields: {
      // Display name: Currency Code
      // Semantic type: type/Category
      currencyCode: {
        type: "column",
        name: "currency_code",
        sourceName: "dim_currency",
        jsType: "string",
        fieldId: 2302,
        tableId: 232,
        baseType: "type/Text"
      },
      // Display name: Currency Key
      currencyKey: {
        type: "column",
        name: "currency_key",
        sourceName: "dim_currency",
        jsType: "number",
        fieldId: 2301,
        tableId: 232,
        baseType: "type/BigInteger"
      },
      // Display name: Currency Name
      // Semantic type: type/Category
      currencyName: {
        type: "column",
        name: "currency_name",
        sourceName: "dim_currency",
        jsType: "string",
        fieldId: 2303,
        tableId: 232,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_customer
  dimCustomer: {
    type: "table",
    id: 233,
    name: "Dim Customer",
    fields: {
      // Display name: Customer Key
      customerKey: {
        type: "column",
        name: "customer_key",
        sourceName: "dim_customer",
        jsType: "number",
        fieldId: 2304,
        tableId: 233,
        baseType: "type/BigInteger"
      },
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "dim_customer",
        jsType: "string",
        fieldId: 2305,
        tableId: 233,
        baseType: "type/Text"
      },
      // Display name: First Order Date
      firstOrderDate: {
        type: "column",
        name: "first_order_date",
        sourceName: "dim_customer",
        jsType: "Date",
        fieldId: 2309,
        tableId: 233,
        baseType: "type/Date"
      },
      // Display name: Industry Name
      industryName: {
        type: "column",
        name: "industry_name",
        sourceName: "dim_customer",
        jsType: "string",
        fieldId: 2307,
        tableId: 233,
        baseType: "type/Text"
      },
      // Display name: Is Active
      isActive: {
        type: "column",
        name: "is_active",
        sourceName: "dim_customer",
        jsType: "boolean",
        fieldId: 2310,
        tableId: 233,
        baseType: "type/Boolean"
      },
      // Display name: Region Key
      regionKey: {
        type: "column",
        name: "region_key",
        sourceName: "dim_customer",
        jsType: "number",
        fieldId: 2308,
        tableId: 233,
        baseType: "type/BigInteger"
      },
      // Display name: Segment Name
      segmentName: {
        type: "column",
        name: "segment_name",
        sourceName: "dim_customer",
        jsType: "string",
        fieldId: 2306,
        tableId: 233,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_date
  dimDate: {
    type: "table",
    id: 234,
    name: "Dim Date",
    fields: {
      // Display name: Calendar Date
      calendarDate: {
        type: "column",
        name: "calendar_date",
        sourceName: "dim_date",
        jsType: "Date",
        fieldId: 2312,
        tableId: 234,
        baseType: "type/Date"
      },
      // Display name: Calendar Year
      calendarYear: {
        type: "column",
        name: "calendar_year",
        sourceName: "dim_date",
        jsType: "number",
        fieldId: 2319,
        tableId: 234,
        baseType: "type/Integer"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "dim_date",
        jsType: "number",
        fieldId: 2311,
        tableId: 234,
        baseType: "type/BigInteger"
      },
      // Display name: Day Name
      // Semantic type: type/Category
      dayName: {
        type: "column",
        name: "day_name",
        sourceName: "dim_date",
        jsType: "string",
        fieldId: 2313,
        tableId: 234,
        baseType: "type/Text"
      },
      // Display name: Day Of Week
      dayOfWeek: {
        type: "column",
        name: "day_of_week",
        sourceName: "dim_date",
        jsType: "number",
        fieldId: 2314,
        tableId: 234,
        baseType: "type/Integer"
      },
      // Display name: Is Holiday
      isHoliday: {
        type: "column",
        name: "is_holiday",
        sourceName: "dim_date",
        jsType: "boolean",
        fieldId: 2321,
        tableId: 234,
        baseType: "type/Boolean"
      },
      // Display name: Is Weekend
      isWeekend: {
        type: "column",
        name: "is_weekend",
        sourceName: "dim_date",
        jsType: "boolean",
        fieldId: 2320,
        tableId: 234,
        baseType: "type/Boolean"
      },
      // Display name: Month Name
      // Semantic type: type/Category
      monthName: {
        type: "column",
        name: "month_name",
        sourceName: "dim_date",
        jsType: "string",
        fieldId: 2317,
        tableId: 234,
        baseType: "type/Text"
      },
      // Display name: Month Number
      // Semantic type: type/Quantity
      monthNumber: {
        type: "column",
        name: "month_number",
        sourceName: "dim_date",
        jsType: "number",
        fieldId: 2316,
        tableId: 234,
        baseType: "type/Integer"
      },
      // Display name: Quarter Number
      // Semantic type: type/Quantity
      quarterNumber: {
        type: "column",
        name: "quarter_number",
        sourceName: "dim_date",
        jsType: "number",
        fieldId: 2318,
        tableId: 234,
        baseType: "type/Integer"
      },
      // Display name: Week Of Year
      weekOfYear: {
        type: "column",
        name: "week_of_year",
        sourceName: "dim_date",
        jsType: "number",
        fieldId: 2315,
        tableId: 234,
        baseType: "type/Integer"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_department
  dimDepartment: {
    type: "table",
    id: 235,
    name: "Dim Department",
    fields: {
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "dim_department",
        jsType: "number",
        fieldId: 2322,
        tableId: 235,
        baseType: "type/BigInteger"
      },
      // Display name: Department Name
      // Semantic type: type/Category
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "dim_department",
        jsType: "string",
        fieldId: 2323,
        tableId: 235,
        baseType: "type/Text"
      },
      // Display name: Function Name
      // Semantic type: type/Category
      functionName: {
        type: "column",
        name: "function_name",
        sourceName: "dim_department",
        jsType: "string",
        fieldId: 2324,
        tableId: 235,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_location
  dimLocation: {
    type: "table",
    id: 236,
    name: "Dim Location",
    fields: {
      // Display name: City Name
      cityName: {
        type: "column",
        name: "city_name",
        sourceName: "dim_location",
        jsType: "string",
        fieldId: 2327,
        tableId: 236,
        baseType: "type/Text"
      },
      // Display name: Is Remote
      isRemote: {
        type: "column",
        name: "is_remote",
        sourceName: "dim_location",
        jsType: "boolean",
        fieldId: 2329,
        tableId: 236,
        baseType: "type/Boolean"
      },
      // Display name: Location Key
      locationKey: {
        type: "column",
        name: "location_key",
        sourceName: "dim_location",
        jsType: "number",
        fieldId: 2325,
        tableId: 236,
        baseType: "type/BigInteger"
      },
      // Display name: Location Name
      locationName: {
        type: "column",
        name: "location_name",
        sourceName: "dim_location",
        jsType: "string",
        fieldId: 2326,
        tableId: 236,
        baseType: "type/Text"
      },
      // Display name: Region Key
      regionKey: {
        type: "column",
        name: "region_key",
        sourceName: "dim_location",
        jsType: "number",
        fieldId: 2328,
        tableId: 236,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_person
  dimPerson: {
    type: "table",
    id: 237,
    name: "Dim Person",
    fields: {
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "dim_person",
        jsType: "number",
        fieldId: 2334,
        tableId: 237,
        baseType: "type/BigInteger"
      },
      // Display name: Email
      email: {
        type: "column",
        name: "email",
        sourceName: "dim_person",
        jsType: "string",
        fieldId: 2332,
        tableId: 237,
        baseType: "type/Text"
      },
      // Display name: Employment Type
      employmentType: {
        type: "column",
        name: "employment_type",
        sourceName: "dim_person",
        jsType: "string",
        fieldId: 2338,
        tableId: 237,
        baseType: "type/Text"
      },
      // Display name: Full Name
      fullName: {
        type: "column",
        name: "full_name",
        sourceName: "dim_person",
        jsType: "string",
        fieldId: 2331,
        tableId: 237,
        baseType: "type/Text"
      },
      // Display name: Hire Date
      hireDate: {
        type: "column",
        name: "hire_date",
        sourceName: "dim_person",
        jsType: "Date",
        fieldId: 2336,
        tableId: 237,
        baseType: "type/Date"
      },
      // Display name: Is Active
      isActive: {
        type: "column",
        name: "is_active",
        sourceName: "dim_person",
        jsType: "boolean",
        fieldId: 2339,
        tableId: 237,
        baseType: "type/Boolean"
      },
      // Display name: Job Title
      jobTitle: {
        type: "column",
        name: "job_title",
        sourceName: "dim_person",
        jsType: "string",
        fieldId: 2333,
        tableId: 237,
        baseType: "type/Text"
      },
      // Display name: Manager Person Key
      managerPersonKey: {
        type: "column",
        name: "manager_person_key",
        sourceName: "dim_person",
        jsType: "number",
        fieldId: 2335,
        tableId: 237,
        baseType: "type/BigInteger"
      },
      // Display name: Person Key
      personKey: {
        type: "column",
        name: "person_key",
        sourceName: "dim_person",
        jsType: "number",
        fieldId: 2330,
        tableId: 237,
        baseType: "type/BigInteger"
      },
      // Display name: Termination Date
      terminationDate: {
        type: "column",
        name: "termination_date",
        sourceName: "dim_person",
        jsType: "Date",
        fieldId: 2337,
        tableId: 237,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_position
  dimPosition: {
    type: "table",
    id: 238,
    name: "Dim Position",
    fields: {
      // Display name: Job Family
      jobFamily: {
        type: "column",
        name: "job_family",
        sourceName: "dim_position",
        jsType: "string",
        fieldId: 2343,
        tableId: 238,
        baseType: "type/Text"
      },
      // Display name: Job Level
      jobLevel: {
        type: "column",
        name: "job_level",
        sourceName: "dim_position",
        jsType: "string",
        fieldId: 2342,
        tableId: 238,
        baseType: "type/Text"
      },
      // Display name: Job Title
      jobTitle: {
        type: "column",
        name: "job_title",
        sourceName: "dim_position",
        jsType: "string",
        fieldId: 2341,
        tableId: 238,
        baseType: "type/Text"
      },
      // Display name: Max Salary
      maxSalary: {
        type: "column",
        name: "max_salary",
        sourceName: "dim_position",
        jsType: "number",
        fieldId: 2345,
        tableId: 238,
        baseType: "type/Decimal"
      },
      // Display name: Min Salary
      minSalary: {
        type: "column",
        name: "min_salary",
        sourceName: "dim_position",
        jsType: "number",
        fieldId: 2344,
        tableId: 238,
        baseType: "type/Decimal"
      },
      // Display name: Position Key
      positionKey: {
        type: "column",
        name: "position_key",
        sourceName: "dim_position",
        jsType: "number",
        fieldId: 2340,
        tableId: 238,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_product
  dimProduct: {
    type: "table",
    id: 239,
    name: "Dim Product",
    fields: {
      // Display name: Brand Name
      brandName: {
        type: "column",
        name: "brand_name",
        sourceName: "dim_product",
        jsType: "string",
        fieldId: 2351,
        tableId: 239,
        baseType: "type/Text"
      },
      // Display name: Category Name
      categoryName: {
        type: "column",
        name: "category_name",
        sourceName: "dim_product",
        jsType: "string",
        fieldId: 2349,
        tableId: 239,
        baseType: "type/Text"
      },
      // Display name: Is Discontinued
      isDiscontinued: {
        type: "column",
        name: "is_discontinued",
        sourceName: "dim_product",
        jsType: "boolean",
        fieldId: 2354,
        tableId: 239,
        baseType: "type/Boolean"
      },
      // Display name: List Price
      listPrice: {
        type: "column",
        name: "list_price",
        sourceName: "dim_product",
        jsType: "number",
        fieldId: 2353,
        tableId: 239,
        baseType: "type/Decimal"
      },
      // Display name: Product Key
      productKey: {
        type: "column",
        name: "product_key",
        sourceName: "dim_product",
        jsType: "number",
        fieldId: 2346,
        tableId: 239,
        baseType: "type/BigInteger"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "dim_product",
        jsType: "string",
        fieldId: 2348,
        tableId: 239,
        baseType: "type/Text"
      },
      // Display name: Sku Code
      skuCode: {
        type: "column",
        name: "sku_code",
        sourceName: "dim_product",
        jsType: "string",
        fieldId: 2347,
        tableId: 239,
        baseType: "type/Text"
      },
      // Display name: Subcategory Name
      subcategoryName: {
        type: "column",
        name: "subcategory_name",
        sourceName: "dim_product",
        jsType: "string",
        fieldId: 2350,
        tableId: 239,
        baseType: "type/Text"
      },
      // Display name: Unit Cost
      unitCost: {
        type: "column",
        name: "unit_cost",
        sourceName: "dim_product",
        jsType: "number",
        fieldId: 2352,
        tableId: 239,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_promotion
  dimPromotion: {
    type: "table",
    id: 240,
    name: "Dim Promotion",
    fields: {
      // Display name: Discount Pct
      discountPct: {
        type: "column",
        name: "discount_pct",
        sourceName: "dim_promotion",
        jsType: "number",
        fieldId: 2360,
        tableId: 240,
        baseType: "type/Decimal"
      },
      // Display name: End Date
      endDate: {
        type: "column",
        name: "end_date",
        sourceName: "dim_promotion",
        jsType: "Date",
        fieldId: 2359,
        tableId: 240,
        baseType: "type/Date"
      },
      // Display name: Promotion Key
      promotionKey: {
        type: "column",
        name: "promotion_key",
        sourceName: "dim_promotion",
        jsType: "number",
        fieldId: 2355,
        tableId: 240,
        baseType: "type/BigInteger"
      },
      // Display name: Promotion Name
      promotionName: {
        type: "column",
        name: "promotion_name",
        sourceName: "dim_promotion",
        jsType: "string",
        fieldId: 2356,
        tableId: 240,
        baseType: "type/Text"
      },
      // Display name: Promotion Type
      promotionType: {
        type: "column",
        name: "promotion_type",
        sourceName: "dim_promotion",
        jsType: "string",
        fieldId: 2357,
        tableId: 240,
        baseType: "type/Text"
      },
      // Display name: Start Date
      startDate: {
        type: "column",
        name: "start_date",
        sourceName: "dim_promotion",
        jsType: "Date",
        fieldId: 2358,
        tableId: 240,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_region
  dimRegion: {
    type: "table",
    id: 241,
    name: "Dim Region",
    fields: {
      // Display name: Continent Name
      // Semantic type: type/Category
      continentName: {
        type: "column",
        name: "continent_name",
        sourceName: "dim_region",
        jsType: "string",
        fieldId: 2364,
        tableId: 241,
        baseType: "type/Text"
      },
      // Display name: Country Name
      // Semantic type: type/Country
      countryName: {
        type: "column",
        name: "country_name",
        sourceName: "dim_region",
        jsType: "string",
        fieldId: 2363,
        tableId: 241,
        baseType: "type/Text"
      },
      // Display name: Region Key
      regionKey: {
        type: "column",
        name: "region_key",
        sourceName: "dim_region",
        jsType: "number",
        fieldId: 2361,
        tableId: 241,
        baseType: "type/BigInteger"
      },
      // Display name: Region Name
      // Semantic type: type/Category
      regionName: {
        type: "column",
        name: "region_name",
        sourceName: "dim_region",
        jsType: "string",
        fieldId: 2362,
        tableId: 241,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_supplier
  dimSupplier: {
    type: "table",
    id: 242,
    name: "Dim Supplier",
    fields: {
      // Display name: Country Name
      countryName: {
        type: "column",
        name: "country_name",
        sourceName: "dim_supplier",
        jsType: "string",
        fieldId: 2367,
        tableId: 242,
        baseType: "type/Text"
      },
      // Display name: Lead Time Days
      leadTimeDays: {
        type: "column",
        name: "lead_time_days",
        sourceName: "dim_supplier",
        jsType: "number",
        fieldId: 2369,
        tableId: 242,
        baseType: "type/Integer"
      },
      // Display name: Payment Terms
      paymentTerms: {
        type: "column",
        name: "payment_terms",
        sourceName: "dim_supplier",
        jsType: "string",
        fieldId: 2368,
        tableId: 242,
        baseType: "type/Text"
      },
      // Display name: Rating Score
      ratingScore: {
        type: "column",
        name: "rating_score",
        sourceName: "dim_supplier",
        jsType: "number",
        fieldId: 2370,
        tableId: 242,
        baseType: "type/Decimal"
      },
      // Display name: Supplier Key
      supplierKey: {
        type: "column",
        name: "supplier_key",
        sourceName: "dim_supplier",
        jsType: "number",
        fieldId: 2365,
        tableId: 242,
        baseType: "type/BigInteger"
      },
      // Display name: Supplier Name
      supplierName: {
        type: "column",
        name: "supplier_name",
        sourceName: "dim_supplier",
        jsType: "string",
        fieldId: 2366,
        tableId: 242,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: dim_warehouse
  dimWarehouse: {
    type: "table",
    id: 243,
    name: "Dim Warehouse",
    fields: {
      // Display name: Capacity Units
      capacityUnits: {
        type: "column",
        name: "capacity_units",
        sourceName: "dim_warehouse",
        jsType: "number",
        fieldId: 2375,
        tableId: 243,
        baseType: "type/Integer"
      },
      // Display name: City Name
      cityName: {
        type: "column",
        name: "city_name",
        sourceName: "dim_warehouse",
        jsType: "string",
        fieldId: 2373,
        tableId: 243,
        baseType: "type/Text"
      },
      // Display name: Region Key
      regionKey: {
        type: "column",
        name: "region_key",
        sourceName: "dim_warehouse",
        jsType: "number",
        fieldId: 2374,
        tableId: 243,
        baseType: "type/BigInteger"
      },
      // Display name: Warehouse Key
      warehouseKey: {
        type: "column",
        name: "warehouse_key",
        sourceName: "dim_warehouse",
        jsType: "number",
        fieldId: 2371,
        tableId: 243,
        baseType: "type/BigInteger"
      },
      // Display name: Warehouse Name
      warehouseName: {
        type: "column",
        name: "warehouse_name",
        sourceName: "dim_warehouse",
        jsType: "string",
        fieldId: 2372,
        tableId: 243,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_attrition
  fctAttrition: {
    type: "table",
    id: 244,
    name: "Fct Attrition",
    fields: {
      // Display name: Attrition Key
      attritionKey: {
        type: "column",
        name: "attrition_key",
        sourceName: "fct_attrition",
        jsType: "number",
        fieldId: 2376,
        tableId: 244,
        baseType: "type/BigInteger"
      },
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "fct_attrition",
        jsType: "number",
        fieldId: 2379,
        tableId: 244,
        baseType: "type/BigInteger"
      },
      // Display name: Is Regretted
      isRegretted: {
        type: "column",
        name: "is_regretted",
        sourceName: "fct_attrition",
        jsType: "boolean",
        fieldId: 2383,
        tableId: 244,
        baseType: "type/Boolean"
      },
      // Display name: Person Key
      personKey: {
        type: "column",
        name: "person_key",
        sourceName: "fct_attrition",
        jsType: "number",
        fieldId: 2378,
        tableId: 244,
        baseType: "type/BigInteger"
      },
      // Display name: Reason Name
      reasonName: {
        type: "column",
        name: "reason_name",
        sourceName: "fct_attrition",
        jsType: "string",
        fieldId: 2381,
        tableId: 244,
        baseType: "type/Text"
      },
      // Display name: Tenure Days
      tenureDays: {
        type: "column",
        name: "tenure_days",
        sourceName: "fct_attrition",
        jsType: "number",
        fieldId: 2382,
        tableId: 244,
        baseType: "type/Integer"
      },
      // Display name: Termination Date Key
      terminationDateKey: {
        type: "column",
        name: "termination_date_key",
        sourceName: "fct_attrition",
        jsType: "number",
        fieldId: 2377,
        tableId: 244,
        baseType: "type/BigInteger"
      },
      // Display name: Termination Type
      terminationType: {
        type: "column",
        name: "termination_type",
        sourceName: "fct_attrition",
        jsType: "string",
        fieldId: 2380,
        tableId: 244,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_budget_vs_actual
  fctBudgetVsActual: {
    type: "table",
    id: 245,
    name: "Fct Budget Vs Actual",
    fields: {
      // Display name: Account Key
      accountKey: {
        type: "column",
        name: "account_key",
        sourceName: "fct_budget_vs_actual",
        jsType: "number",
        fieldId: 2387,
        tableId: 245,
        baseType: "type/BigInteger"
      },
      // Display name: Actual Amount
      actualAmount: {
        type: "column",
        name: "actual_amount",
        sourceName: "fct_budget_vs_actual",
        jsType: "number",
        fieldId: 2389,
        tableId: 245,
        baseType: "type/Decimal"
      },
      // Display name: Budget Actual Key
      budgetActualKey: {
        type: "column",
        name: "budget_actual_key",
        sourceName: "fct_budget_vs_actual",
        jsType: "number",
        fieldId: 2384,
        tableId: 245,
        baseType: "type/BigInteger"
      },
      // Display name: Budget Amount
      budgetAmount: {
        type: "column",
        name: "budget_amount",
        sourceName: "fct_budget_vs_actual",
        jsType: "number",
        fieldId: 2388,
        tableId: 245,
        baseType: "type/Decimal"
      },
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "fct_budget_vs_actual",
        jsType: "number",
        fieldId: 2386,
        tableId: 245,
        baseType: "type/BigInteger"
      },
      // Display name: Month Date Key
      monthDateKey: {
        type: "column",
        name: "month_date_key",
        sourceName: "fct_budget_vs_actual",
        jsType: "number",
        fieldId: 2385,
        tableId: 245,
        baseType: "type/BigInteger"
      },
      // Display name: Variance Amount
      varianceAmount: {
        type: "column",
        name: "variance_amount",
        sourceName: "fct_budget_vs_actual",
        jsType: "number",
        fieldId: 2390,
        tableId: 245,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_campaign_performance
  fctCampaignPerformance: {
    type: "table",
    id: 246,
    name: "Fct Campaign Performance",
    fields: {
      // Display name: Campaign Key
      campaignKey: {
        type: "column",
        name: "campaign_key",
        sourceName: "fct_campaign_performance",
        jsType: "number",
        fieldId: 2393,
        tableId: 246,
        baseType: "type/BigInteger"
      },
      // Display name: Cost Amount
      costAmount: {
        type: "column",
        name: "cost_amount",
        sourceName: "fct_campaign_performance",
        jsType: "number",
        fieldId: 2397,
        tableId: 246,
        baseType: "type/Decimal"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_campaign_performance",
        jsType: "number",
        fieldId: 2392,
        tableId: 246,
        baseType: "type/BigInteger"
      },
      // Display name: Leads Count
      leadsCount: {
        type: "column",
        name: "leads_count",
        sourceName: "fct_campaign_performance",
        jsType: "number",
        fieldId: 2394,
        tableId: 246,
        baseType: "type/Integer"
      },
      // Display name: Opportunities Count
      opportunitiesCount: {
        type: "column",
        name: "opportunities_count",
        sourceName: "fct_campaign_performance",
        jsType: "number",
        fieldId: 2395,
        tableId: 246,
        baseType: "type/Integer"
      },
      // Display name: Performance Key
      performanceKey: {
        type: "column",
        name: "performance_key",
        sourceName: "fct_campaign_performance",
        jsType: "number",
        fieldId: 2391,
        tableId: 246,
        baseType: "type/BigInteger"
      },
      // Display name: Revenue Amount
      revenueAmount: {
        type: "column",
        name: "revenue_amount",
        sourceName: "fct_campaign_performance",
        jsType: "number",
        fieldId: 2396,
        tableId: 246,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_gl_entries
  fctGlEntries: {
    type: "table",
    id: 247,
    name: "Fct Gl Entries",
    fields: {
      // Display name: Account Key
      accountKey: {
        type: "column",
        name: "account_key",
        sourceName: "fct_gl_entries",
        jsType: "number",
        fieldId: 2400,
        tableId: 247,
        baseType: "type/BigInteger"
      },
      // Display name: Cost Center Key
      costCenterKey: {
        type: "column",
        name: "cost_center_key",
        sourceName: "fct_gl_entries",
        jsType: "number",
        fieldId: 2401,
        tableId: 247,
        baseType: "type/BigInteger"
      },
      // Display name: Credit Amount
      creditAmount: {
        type: "column",
        name: "credit_amount",
        sourceName: "fct_gl_entries",
        jsType: "number",
        fieldId: 2404,
        tableId: 247,
        baseType: "type/Decimal"
      },
      // Display name: Currency Key
      currencyKey: {
        type: "column",
        name: "currency_key",
        sourceName: "fct_gl_entries",
        jsType: "number",
        fieldId: 2402,
        tableId: 247,
        baseType: "type/BigInteger"
      },
      // Display name: Debit Amount
      debitAmount: {
        type: "column",
        name: "debit_amount",
        sourceName: "fct_gl_entries",
        jsType: "number",
        fieldId: 2403,
        tableId: 247,
        baseType: "type/Decimal"
      },
      // Display name: Gl Entry Key
      glEntryKey: {
        type: "column",
        name: "gl_entry_key",
        sourceName: "fct_gl_entries",
        jsType: "number",
        fieldId: 2398,
        tableId: 247,
        baseType: "type/BigInteger"
      },
      // Display name: Posting Date Key
      postingDateKey: {
        type: "column",
        name: "posting_date_key",
        sourceName: "fct_gl_entries",
        jsType: "number",
        fieldId: 2399,
        tableId: 247,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_inventory_movements
  fctInventoryMovements: {
    type: "table",
    id: 248,
    name: "Fct Inventory Movements",
    fields: {
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_inventory_movements",
        jsType: "number",
        fieldId: 2406,
        tableId: 248,
        baseType: "type/BigInteger"
      },
      // Display name: Movement Key
      movementKey: {
        type: "column",
        name: "movement_key",
        sourceName: "fct_inventory_movements",
        jsType: "number",
        fieldId: 2405,
        tableId: 248,
        baseType: "type/BigInteger"
      },
      // Display name: Movement Type
      movementType: {
        type: "column",
        name: "movement_type",
        sourceName: "fct_inventory_movements",
        jsType: "string",
        fieldId: 2409,
        tableId: 248,
        baseType: "type/Text"
      },
      // Display name: Product Key
      productKey: {
        type: "column",
        name: "product_key",
        sourceName: "fct_inventory_movements",
        jsType: "number",
        fieldId: 2407,
        tableId: 248,
        baseType: "type/BigInteger"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "fct_inventory_movements",
        jsType: "number",
        fieldId: 2410,
        tableId: 248,
        baseType: "type/Integer"
      },
      // Display name: Unit Cost
      unitCost: {
        type: "column",
        name: "unit_cost",
        sourceName: "fct_inventory_movements",
        jsType: "number",
        fieldId: 2411,
        tableId: 248,
        baseType: "type/Decimal"
      },
      // Display name: Warehouse Key
      warehouseKey: {
        type: "column",
        name: "warehouse_key",
        sourceName: "fct_inventory_movements",
        jsType: "number",
        fieldId: 2408,
        tableId: 248,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_inventory_snapshot
  fctInventorySnapshot: {
    type: "table",
    id: 249,
    name: "Fct Inventory Snapshot",
    fields: {
      // Display name: Inventory Value
      inventoryValue: {
        type: "column",
        name: "inventory_value",
        sourceName: "fct_inventory_snapshot",
        jsType: "number",
        fieldId: 2418,
        tableId: 249,
        baseType: "type/Decimal"
      },
      // Display name: On Hand Quantity
      onHandQuantity: {
        type: "column",
        name: "on_hand_quantity",
        sourceName: "fct_inventory_snapshot",
        jsType: "number",
        fieldId: 2416,
        tableId: 249,
        baseType: "type/Integer"
      },
      // Display name: Product Key
      productKey: {
        type: "column",
        name: "product_key",
        sourceName: "fct_inventory_snapshot",
        jsType: "number",
        fieldId: 2414,
        tableId: 249,
        baseType: "type/BigInteger"
      },
      // Display name: Reserved Quantity
      reservedQuantity: {
        type: "column",
        name: "reserved_quantity",
        sourceName: "fct_inventory_snapshot",
        jsType: "number",
        fieldId: 2417,
        tableId: 249,
        baseType: "type/Integer"
      },
      // Display name: Snapshot Date Key
      snapshotDateKey: {
        type: "column",
        name: "snapshot_date_key",
        sourceName: "fct_inventory_snapshot",
        jsType: "number",
        fieldId: 2413,
        tableId: 249,
        baseType: "type/BigInteger"
      },
      // Display name: Snapshot Key
      snapshotKey: {
        type: "column",
        name: "snapshot_key",
        sourceName: "fct_inventory_snapshot",
        jsType: "number",
        fieldId: 2412,
        tableId: 249,
        baseType: "type/BigInteger"
      },
      // Display name: Warehouse Key
      warehouseKey: {
        type: "column",
        name: "warehouse_key",
        sourceName: "fct_inventory_snapshot",
        jsType: "number",
        fieldId: 2415,
        tableId: 249,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_invoices
  fctInvoices: {
    type: "table",
    id: 250,
    name: "Fct Invoices",
    fields: {
      // Display name: Currency Key
      currencyKey: {
        type: "column",
        name: "currency_key",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2423,
        tableId: 250,
        baseType: "type/BigInteger"
      },
      // Display name: Customer Key
      customerKey: {
        type: "column",
        name: "customer_key",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2422,
        tableId: 250,
        baseType: "type/BigInteger"
      },
      // Display name: Due Date Key
      dueDateKey: {
        type: "column",
        name: "due_date_key",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2421,
        tableId: 250,
        baseType: "type/BigInteger"
      },
      // Display name: Invoice Date Key
      invoiceDateKey: {
        type: "column",
        name: "invoice_date_key",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2420,
        tableId: 250,
        baseType: "type/BigInteger"
      },
      // Display name: Invoice Key
      invoiceKey: {
        type: "column",
        name: "invoice_key",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2419,
        tableId: 250,
        baseType: "type/BigInteger"
      },
      // Display name: Invoice Total
      invoiceTotal: {
        type: "column",
        name: "invoice_total",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2424,
        tableId: 250,
        baseType: "type/Decimal"
      },
      // Display name: Open Balance
      openBalance: {
        type: "column",
        name: "open_balance",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2426,
        tableId: 250,
        baseType: "type/Decimal"
      },
      // Display name: Paid Amount
      paidAmount: {
        type: "column",
        name: "paid_amount",
        sourceName: "fct_invoices",
        jsType: "number",
        fieldId: 2425,
        tableId: 250,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_lead_conversions
  fctLeadConversions: {
    type: "table",
    id: 251,
    name: "Fct Lead Conversions",
    fields: {
      // Display name: Campaign Key
      campaignKey: {
        type: "column",
        name: "campaign_key",
        sourceName: "fct_lead_conversions",
        jsType: "number",
        fieldId: 2429,
        tableId: 251,
        baseType: "type/BigInteger"
      },
      // Display name: Conversion Key
      conversionKey: {
        type: "column",
        name: "conversion_key",
        sourceName: "fct_lead_conversions",
        jsType: "number",
        fieldId: 2427,
        tableId: 251,
        baseType: "type/BigInteger"
      },
      // Display name: Convert Days
      convertDays: {
        type: "column",
        name: "convert_days",
        sourceName: "fct_lead_conversions",
        jsType: "number",
        fieldId: 2433,
        tableId: 251,
        baseType: "type/Integer"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_lead_conversions",
        jsType: "number",
        fieldId: 2428,
        tableId: 251,
        baseType: "type/BigInteger"
      },
      // Display name: Deal Amount
      dealAmount: {
        type: "column",
        name: "deal_amount",
        sourceName: "fct_lead_conversions",
        jsType: "number",
        fieldId: 2432,
        tableId: 251,
        baseType: "type/Decimal"
      },
      // Display name: First Touch Channel Key
      firstTouchChannelKey: {
        type: "column",
        name: "first_touch_channel_key",
        sourceName: "fct_lead_conversions",
        jsType: "number",
        fieldId: 2430,
        tableId: 251,
        baseType: "type/BigInteger"
      },
      // Display name: Last Touch Channel Key
      lastTouchChannelKey: {
        type: "column",
        name: "last_touch_channel_key",
        sourceName: "fct_lead_conversions",
        jsType: "number",
        fieldId: 2431,
        tableId: 251,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_marketing_spend
  fctMarketingSpend: {
    type: "table",
    id: 252,
    name: "Fct Marketing Spend",
    fields: {
      // Display name: Campaign Key
      campaignKey: {
        type: "column",
        name: "campaign_key",
        sourceName: "fct_marketing_spend",
        jsType: "number",
        fieldId: 2436,
        tableId: 252,
        baseType: "type/BigInteger"
      },
      // Display name: Channel Key
      channelKey: {
        type: "column",
        name: "channel_key",
        sourceName: "fct_marketing_spend",
        jsType: "number",
        fieldId: 2437,
        tableId: 252,
        baseType: "type/BigInteger"
      },
      // Display name: Clicks
      clicks: {
        type: "column",
        name: "clicks",
        sourceName: "fct_marketing_spend",
        jsType: "number",
        fieldId: 2439,
        tableId: 252,
        baseType: "type/Integer"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_marketing_spend",
        jsType: "number",
        fieldId: 2435,
        tableId: 252,
        baseType: "type/BigInteger"
      },
      // Display name: Impressions
      impressions: {
        type: "column",
        name: "impressions",
        sourceName: "fct_marketing_spend",
        jsType: "number",
        fieldId: 2438,
        tableId: 252,
        baseType: "type/Integer"
      },
      // Display name: Spend Amount
      spendAmount: {
        type: "column",
        name: "spend_amount",
        sourceName: "fct_marketing_spend",
        jsType: "number",
        fieldId: 2440,
        tableId: 252,
        baseType: "type/Decimal"
      },
      // Display name: Spend Key
      spendKey: {
        type: "column",
        name: "spend_key",
        sourceName: "fct_marketing_spend",
        jsType: "number",
        fieldId: 2434,
        tableId: 252,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_order_lines
  fctOrderLines: {
    type: "table",
    id: 253,
    name: "Fct Order Lines",
    fields: {
      // Display name: Customer Key
      customerKey: {
        type: "column",
        name: "customer_key",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2445,
        tableId: 253,
        baseType: "type/BigInteger"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2443,
        tableId: 253,
        baseType: "type/BigInteger"
      },
      // Display name: Line Total
      lineTotal: {
        type: "column",
        name: "line_total",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2448,
        tableId: 253,
        baseType: "type/Decimal"
      },
      // Display name: Order ID
      orderId: {
        type: "column",
        name: "order_id",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2442,
        tableId: 253,
        baseType: "type/BigInteger"
      },
      // Display name: Order Line Key
      orderLineKey: {
        type: "column",
        name: "order_line_key",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2441,
        tableId: 253,
        baseType: "type/BigInteger"
      },
      // Display name: Product Key
      productKey: {
        type: "column",
        name: "product_key",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2444,
        tableId: 253,
        baseType: "type/BigInteger"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2446,
        tableId: 253,
        baseType: "type/Integer"
      },
      // Display name: Unit Price
      unitPrice: {
        type: "column",
        name: "unit_price",
        sourceName: "fct_order_lines",
        jsType: "number",
        fieldId: 2447,
        tableId: 253,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_payroll
  fctPayroll: {
    type: "table",
    id: 254,
    name: "Fct Payroll",
    fields: {
      // Display name: Deduction Amount
      deductionAmount: {
        type: "column",
        name: "deduction_amount",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2455,
        tableId: 254,
        baseType: "type/Decimal"
      },
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2452,
        tableId: 254,
        baseType: "type/BigInteger"
      },
      // Display name: Gross Amount
      grossAmount: {
        type: "column",
        name: "gross_amount",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2453,
        tableId: 254,
        baseType: "type/Decimal"
      },
      // Display name: Net Amount
      netAmount: {
        type: "column",
        name: "net_amount",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2456,
        tableId: 254,
        baseType: "type/Decimal"
      },
      // Display name: Pay Date Key
      payDateKey: {
        type: "column",
        name: "pay_date_key",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2450,
        tableId: 254,
        baseType: "type/BigInteger"
      },
      // Display name: Payroll Key
      payrollKey: {
        type: "column",
        name: "payroll_key",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2449,
        tableId: 254,
        baseType: "type/BigInteger"
      },
      // Display name: Person Key
      personKey: {
        type: "column",
        name: "person_key",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2451,
        tableId: 254,
        baseType: "type/BigInteger"
      },
      // Display name: Tax Amount
      taxAmount: {
        type: "column",
        name: "tax_amount",
        sourceName: "fct_payroll",
        jsType: "number",
        fieldId: 2454,
        tableId: 254,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_productivity
  fctProductivity: {
    type: "table",
    id: 255,
    name: "Fct Productivity",
    fields: {
      // Display name: Billable Hours
      billableHours: {
        type: "column",
        name: "billable_hours",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2462,
        tableId: 255,
        baseType: "type/Decimal"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2458,
        tableId: 255,
        baseType: "type/BigInteger"
      },
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2460,
        tableId: 255,
        baseType: "type/BigInteger"
      },
      // Display name: Output Score
      outputScore: {
        type: "column",
        name: "output_score",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2464,
        tableId: 255,
        baseType: "type/Decimal"
      },
      // Display name: Person Key
      personKey: {
        type: "column",
        name: "person_key",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2459,
        tableId: 255,
        baseType: "type/BigInteger"
      },
      // Display name: Productivity Key
      productivityKey: {
        type: "column",
        name: "productivity_key",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2457,
        tableId: 255,
        baseType: "type/BigInteger"
      },
      // Display name: Tasks Completed Count
      tasksCompletedCount: {
        type: "column",
        name: "tasks_completed_count",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2461,
        tableId: 255,
        baseType: "type/Integer"
      },
      // Display name: Utilization Rate
      utilizationRate: {
        type: "column",
        name: "utilization_rate",
        sourceName: "fct_productivity",
        jsType: "number",
        fieldId: 2463,
        tableId: 255,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_purchase_orders
  fctPurchaseOrders: {
    type: "table",
    id: 256,
    name: "Fct Purchase Orders",
    fields: {
      // Display name: Line Total
      lineTotal: {
        type: "column",
        name: "line_total",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2472,
        tableId: 256,
        baseType: "type/Decimal"
      },
      // Display name: Order Date Key
      orderDateKey: {
        type: "column",
        name: "order_date_key",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2466,
        tableId: 256,
        baseType: "type/BigInteger"
      },
      // Display name: Product Key
      productKey: {
        type: "column",
        name: "product_key",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2468,
        tableId: 256,
        baseType: "type/BigInteger"
      },
      // Display name: Purchase Order Key
      purchaseOrderKey: {
        type: "column",
        name: "purchase_order_key",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2465,
        tableId: 256,
        baseType: "type/BigInteger"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2470,
        tableId: 256,
        baseType: "type/Integer"
      },
      // Display name: Supplier Key
      supplierKey: {
        type: "column",
        name: "supplier_key",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2467,
        tableId: 256,
        baseType: "type/BigInteger"
      },
      // Display name: Unit Cost
      unitCost: {
        type: "column",
        name: "unit_cost",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2471,
        tableId: 256,
        baseType: "type/Decimal"
      },
      // Display name: Warehouse Key
      warehouseKey: {
        type: "column",
        name: "warehouse_key",
        sourceName: "fct_purchase_orders",
        jsType: "number",
        fieldId: 2469,
        tableId: 256,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_recruitment
  fctRecruitment: {
    type: "table",
    id: 257,
    name: "Fct Recruitment",
    fields: {
      // Display name: Application Date Key
      applicationDateKey: {
        type: "column",
        name: "application_date_key",
        sourceName: "fct_recruitment",
        jsType: "number",
        fieldId: 2474,
        tableId: 257,
        baseType: "type/BigInteger"
      },
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "fct_recruitment",
        jsType: "number",
        fieldId: 2476,
        tableId: 257,
        baseType: "type/BigInteger"
      },
      // Display name: Is Hired
      isHired: {
        type: "column",
        name: "is_hired",
        sourceName: "fct_recruitment",
        jsType: "boolean",
        fieldId: 2480,
        tableId: 257,
        baseType: "type/Boolean"
      },
      // Display name: Offer Amount
      offerAmount: {
        type: "column",
        name: "offer_amount",
        sourceName: "fct_recruitment",
        jsType: "number",
        fieldId: 2481,
        tableId: 257,
        baseType: "type/Decimal"
      },
      // Display name: Position Key
      positionKey: {
        type: "column",
        name: "position_key",
        sourceName: "fct_recruitment",
        jsType: "number",
        fieldId: 2475,
        tableId: 257,
        baseType: "type/BigInteger"
      },
      // Display name: Recruitment Key
      recruitmentKey: {
        type: "column",
        name: "recruitment_key",
        sourceName: "fct_recruitment",
        jsType: "number",
        fieldId: 2473,
        tableId: 257,
        baseType: "type/BigInteger"
      },
      // Display name: Source Name
      sourceName: {
        type: "column",
        name: "source_name",
        sourceName: "fct_recruitment",
        jsType: "string",
        fieldId: 2477,
        tableId: 257,
        baseType: "type/Text"
      },
      // Display name: Stage Days
      stageDays: {
        type: "column",
        name: "stage_days",
        sourceName: "fct_recruitment",
        jsType: "number",
        fieldId: 2479,
        tableId: 257,
        baseType: "type/Integer"
      },
      // Display name: Stage Name
      stageName: {
        type: "column",
        name: "stage_name",
        sourceName: "fct_recruitment",
        jsType: "string",
        fieldId: 2478,
        tableId: 257,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_retention
  fctRetention: {
    type: "table",
    id: 258,
    name: "Fct Retention",
    fields: {
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2484,
        tableId: 258,
        baseType: "type/BigInteger"
      },
      // Display name: Exits Count
      exitsCount: {
        type: "column",
        name: "exits_count",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2488,
        tableId: 258,
        baseType: "type/Integer"
      },
      // Display name: Headcount Count
      headcountCount: {
        type: "column",
        name: "headcount_count",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2486,
        tableId: 258,
        baseType: "type/Integer"
      },
      // Display name: Hires Count
      hiresCount: {
        type: "column",
        name: "hires_count",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2487,
        tableId: 258,
        baseType: "type/Integer"
      },
      // Display name: Location Key
      locationKey: {
        type: "column",
        name: "location_key",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2485,
        tableId: 258,
        baseType: "type/BigInteger"
      },
      // Display name: Retention Key
      retentionKey: {
        type: "column",
        name: "retention_key",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2482,
        tableId: 258,
        baseType: "type/BigInteger"
      },
      // Display name: Retention Rate
      retentionRate: {
        type: "column",
        name: "retention_rate",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2489,
        tableId: 258,
        baseType: "type/Decimal"
      },
      // Display name: Snapshot Date Key
      snapshotDateKey: {
        type: "column",
        name: "snapshot_date_key",
        sourceName: "fct_retention",
        jsType: "number",
        fieldId: 2483,
        tableId: 258,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_sales
  fctSales: {
    type: "table",
    id: 259,
    name: "Fct Sales",
    fields: {
      // Display name: Channel Key
      channelKey: {
        type: "column",
        name: "channel_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2495,
        tableId: 259,
        baseType: "type/BigInteger"
      },
      // Display name: Cost Amount
      costAmount: {
        type: "column",
        name: "cost_amount",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2502,
        tableId: 259,
        baseType: "type/Decimal"
      },
      // Display name: Customer Key
      customerKey: {
        type: "column",
        name: "customer_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2493,
        tableId: 259,
        baseType: "type/BigInteger"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2491,
        tableId: 259,
        baseType: "type/BigInteger"
      },
      // Display name: Discount Amount
      discountAmount: {
        type: "column",
        name: "discount_amount",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2500,
        tableId: 259,
        baseType: "type/Decimal"
      },
      // Display name: Gross Amount
      grossAmount: {
        type: "column",
        name: "gross_amount",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2499,
        tableId: 259,
        baseType: "type/Decimal"
      },
      // Display name: Margin Amount
      marginAmount: {
        type: "column",
        name: "margin_amount",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2503,
        tableId: 259,
        baseType: "type/Decimal"
      },
      // Display name: Net Amount
      netAmount: {
        type: "column",
        name: "net_amount",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2501,
        tableId: 259,
        baseType: "type/Decimal"
      },
      // Display name: Product Key
      productKey: {
        type: "column",
        name: "product_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2492,
        tableId: 259,
        baseType: "type/BigInteger"
      },
      // Display name: Promotion Key
      promotionKey: {
        type: "column",
        name: "promotion_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2496,
        tableId: 259,
        baseType: "type/BigInteger"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2498,
        tableId: 259,
        baseType: "type/Integer"
      },
      // Display name: Region Key
      regionKey: {
        type: "column",
        name: "region_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2494,
        tableId: 259,
        baseType: "type/BigInteger"
      },
      // Display name: Sales Key
      salesKey: {
        type: "column",
        name: "sales_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2490,
        tableId: 259,
        baseType: "type/BigInteger"
      },
      // Display name: Salesperson Person Key
      salespersonPersonKey: {
        type: "column",
        name: "salesperson_person_key",
        sourceName: "fct_sales",
        jsType: "number",
        fieldId: 2497,
        tableId: 259,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_sales_pipeline
  fctSalesPipeline: {
    type: "table",
    id: 260,
    name: "Fct Sales Pipeline",
    fields: {
      // Display name: Customer Key
      customerKey: {
        type: "column",
        name: "customer_key",
        sourceName: "fct_sales_pipeline",
        jsType: "number",
        fieldId: 2506,
        tableId: 260,
        baseType: "type/BigInteger"
      },
      // Display name: Expected Amount
      expectedAmount: {
        type: "column",
        name: "expected_amount",
        sourceName: "fct_sales_pipeline",
        jsType: "number",
        fieldId: 2509,
        tableId: 260,
        baseType: "type/Decimal"
      },
      // Display name: Owner Person Key
      ownerPersonKey: {
        type: "column",
        name: "owner_person_key",
        sourceName: "fct_sales_pipeline",
        jsType: "number",
        fieldId: 2507,
        tableId: 260,
        baseType: "type/BigInteger"
      },
      // Display name: Pipeline Key
      pipelineKey: {
        type: "column",
        name: "pipeline_key",
        sourceName: "fct_sales_pipeline",
        jsType: "number",
        fieldId: 2504,
        tableId: 260,
        baseType: "type/BigInteger"
      },
      // Display name: Probability Pct
      probabilityPct: {
        type: "column",
        name: "probability_pct",
        sourceName: "fct_sales_pipeline",
        jsType: "number",
        fieldId: 2510,
        tableId: 260,
        baseType: "type/Decimal"
      },
      // Display name: Snapshot Date Key
      snapshotDateKey: {
        type: "column",
        name: "snapshot_date_key",
        sourceName: "fct_sales_pipeline",
        jsType: "number",
        fieldId: 2505,
        tableId: 260,
        baseType: "type/BigInteger"
      },
      // Display name: Stage Name
      stageName: {
        type: "column",
        name: "stage_name",
        sourceName: "fct_sales_pipeline",
        jsType: "string",
        fieldId: 2508,
        tableId: 260,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_sales_returns
  fctSalesReturns: {
    type: "table",
    id: 261,
    name: "Fct Sales Returns",
    fields: {
      // Display name: Customer Key
      customerKey: {
        type: "column",
        name: "customer_key",
        sourceName: "fct_sales_returns",
        jsType: "number",
        fieldId: 2514,
        tableId: 261,
        baseType: "type/BigInteger"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_sales_returns",
        jsType: "number",
        fieldId: 2512,
        tableId: 261,
        baseType: "type/BigInteger"
      },
      // Display name: Product Key
      productKey: {
        type: "column",
        name: "product_key",
        sourceName: "fct_sales_returns",
        jsType: "number",
        fieldId: 2513,
        tableId: 261,
        baseType: "type/BigInteger"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "fct_sales_returns",
        jsType: "number",
        fieldId: 2516,
        tableId: 261,
        baseType: "type/Integer"
      },
      // Display name: Refund Amount
      refundAmount: {
        type: "column",
        name: "refund_amount",
        sourceName: "fct_sales_returns",
        jsType: "number",
        fieldId: 2517,
        tableId: 261,
        baseType: "type/Decimal"
      },
      // Display name: Return Key
      returnKey: {
        type: "column",
        name: "return_key",
        sourceName: "fct_sales_returns",
        jsType: "number",
        fieldId: 2511,
        tableId: 261,
        baseType: "type/BigInteger"
      },
      // Display name: Return Reason
      returnReason: {
        type: "column",
        name: "return_reason",
        sourceName: "fct_sales_returns",
        jsType: "string",
        fieldId: 2515,
        tableId: 261,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_timesheets
  fctTimesheets: {
    type: "table",
    id: 262,
    name: "Fct Timesheets",
    fields: {
      // Display name: Department Key
      departmentKey: {
        type: "column",
        name: "department_key",
        sourceName: "fct_timesheets",
        jsType: "number",
        fieldId: 2521,
        tableId: 262,
        baseType: "type/BigInteger"
      },
      // Display name: Overtime Hours
      overtimeHours: {
        type: "column",
        name: "overtime_hours",
        sourceName: "fct_timesheets",
        jsType: "number",
        fieldId: 2523,
        tableId: 262,
        baseType: "type/Decimal"
      },
      // Display name: Person Key
      personKey: {
        type: "column",
        name: "person_key",
        sourceName: "fct_timesheets",
        jsType: "number",
        fieldId: 2520,
        tableId: 262,
        baseType: "type/BigInteger"
      },
      // Display name: Regular Hours
      regularHours: {
        type: "column",
        name: "regular_hours",
        sourceName: "fct_timesheets",
        jsType: "number",
        fieldId: 2522,
        tableId: 262,
        baseType: "type/Decimal"
      },
      // Display name: Timesheet Key
      timesheetKey: {
        type: "column",
        name: "timesheet_key",
        sourceName: "fct_timesheets",
        jsType: "number",
        fieldId: 2518,
        tableId: 262,
        baseType: "type/BigInteger"
      },
      // Display name: Work Date Key
      workDateKey: {
        type: "column",
        name: "work_date_key",
        sourceName: "fct_timesheets",
        jsType: "number",
        fieldId: 2519,
        tableId: 262,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: analytics
  // Table: fct_web_sessions
  fctWebSessions: {
    type: "table",
    id: 263,
    name: "Fct Web Sessions",
    fields: {
      // Display name: Campaign Key
      campaignKey: {
        type: "column",
        name: "campaign_key",
        sourceName: "fct_web_sessions",
        jsType: "number",
        fieldId: 2526,
        tableId: 263,
        baseType: "type/BigInteger"
      },
      // Display name: Date Key
      dateKey: {
        type: "column",
        name: "date_key",
        sourceName: "fct_web_sessions",
        jsType: "number",
        fieldId: 2525,
        tableId: 263,
        baseType: "type/BigInteger"
      },
      // Display name: Device Type
      deviceType: {
        type: "column",
        name: "device_type",
        sourceName: "fct_web_sessions",
        jsType: "string",
        fieldId: 2528,
        tableId: 263,
        baseType: "type/Text"
      },
      // Display name: Is Bounce
      isBounce: {
        type: "column",
        name: "is_bounce",
        sourceName: "fct_web_sessions",
        jsType: "boolean",
        fieldId: 2531,
        tableId: 263,
        baseType: "type/Boolean"
      },
      // Display name: Page Count
      pageCount: {
        type: "column",
        name: "page_count",
        sourceName: "fct_web_sessions",
        jsType: "number",
        fieldId: 2529,
        tableId: 263,
        baseType: "type/Integer"
      },
      // Display name: Region Key
      regionKey: {
        type: "column",
        name: "region_key",
        sourceName: "fct_web_sessions",
        jsType: "number",
        fieldId: 2527,
        tableId: 263,
        baseType: "type/BigInteger"
      },
      // Display name: Session Key
      sessionKey: {
        type: "column",
        name: "session_key",
        sourceName: "fct_web_sessions",
        jsType: "number",
        fieldId: 2524,
        tableId: 263,
        baseType: "type/BigInteger"
      },
      // Display name: Session Seconds
      sessionSeconds: {
        type: "column",
        name: "session_seconds",
        sourceName: "fct_web_sessions",
        jsType: "number",
        fieldId: 2530,
        tableId: 263,
        baseType: "type/Integer"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: feature_flags
  featureFlags: {
    type: "table",
    id: 266,
    name: "Feature Flags",
    fields: {
      // Display name: Flag ID
      flagId: {
        type: "column",
        name: "flag_id",
        sourceName: "feature_flags",
        jsType: "number",
        fieldId: 2247,
        tableId: 266,
        baseType: "type/BigInteger"
      },
      // Display name: Flag Name
      flagName: {
        type: "column",
        name: "flag_name",
        sourceName: "feature_flags",
        jsType: "string",
        fieldId: 2248,
        tableId: 266,
        baseType: "type/Text"
      },
      // Display name: Is Enabled
      isEnabled: {
        type: "column",
        name: "is_enabled",
        sourceName: "feature_flags",
        jsType: "boolean",
        fieldId: 2249,
        tableId: 266,
        baseType: "type/Boolean"
      },
      // Display name: Rollout Pct
      rolloutPct: {
        type: "column",
        name: "rollout_pct",
        sourceName: "feature_flags",
        jsType: "number",
        fieldId: 2250,
        tableId: 266,
        baseType: "type/Decimal"
      },
      // Display name: Updated At
      updatedAt: {
        type: "column",
        name: "updated_at",
        sourceName: "feature_flags",
        jsType: "Date",
        fieldId: 2251,
        tableId: 266,
        baseType: "type/DateTimeWithLocalTZ"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: file_uploads
  fileUploads: {
    type: "table",
    id: 267,
    name: "File Uploads",
    fields: {
      // Display name: Content Type
      contentType: {
        type: "column",
        name: "content_type",
        sourceName: "file_uploads",
        jsType: "string",
        fieldId: 2254,
        tableId: 267,
        baseType: "type/Text"
      },
      // Display name: File Name
      fileName: {
        type: "column",
        name: "file_name",
        sourceName: "file_uploads",
        jsType: "string",
        fieldId: 2253,
        tableId: 267,
        baseType: "type/Text"
      },
      // Display name: Size Bytes
      sizeBytes: {
        type: "column",
        name: "size_bytes",
        sourceName: "file_uploads",
        jsType: "number",
        fieldId: 2255,
        tableId: 267,
        baseType: "type/BigInteger"
      },
      // Display name: Upload ID
      uploadId: {
        type: "column",
        name: "upload_id",
        sourceName: "file_uploads",
        jsType: "number",
        fieldId: 2252,
        tableId: 267,
        baseType: "type/BigInteger"
      },
      // Display name: Uploaded At
      uploadedAt: {
        type: "column",
        name: "uploaded_at",
        sourceName: "file_uploads",
        jsType: "Date",
        fieldId: 2257,
        tableId: 267,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Uploaded By
      uploadedBy: {
        type: "column",
        name: "uploaded_by",
        sourceName: "file_uploads",
        jsType: "string",
        fieldId: 2256,
        tableId: 267,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_accounts_payable
  financeAccountsPayable: {
    type: "table",
    id: 274,
    name: "Finance Accounts Payable",
    fields: {
      // Display name: Bill Date
      billDate: {
        type: "column",
        name: "bill_date",
        sourceName: "finance_accounts_payable",
        jsType: "Date",
        fieldId: 2535,
        tableId: 274,
        baseType: "type/Date"
      },
      // Display name: Bill Number
      billNumber: {
        type: "column",
        name: "bill_number",
        sourceName: "finance_accounts_payable",
        jsType: "string",
        fieldId: 2534,
        tableId: 274,
        baseType: "type/Text"
      },
      // Display name: Bill Status
      billStatus: {
        type: "column",
        name: "bill_status",
        sourceName: "finance_accounts_payable",
        jsType: "string",
        fieldId: 2537,
        tableId: 274,
        baseType: "type/Text"
      },
      // Display name: Bill Total
      billTotal: {
        type: "column",
        name: "bill_total",
        sourceName: "finance_accounts_payable",
        jsType: "number",
        fieldId: 2538,
        tableId: 274,
        baseType: "type/Decimal"
      },
      // Display name: Due Date
      dueDate: {
        type: "column",
        name: "due_date",
        sourceName: "finance_accounts_payable",
        jsType: "Date",
        fieldId: 2536,
        tableId: 274,
        baseType: "type/Date"
      },
      // Display name: Paid Amount
      paidAmount: {
        type: "column",
        name: "paid_amount",
        sourceName: "finance_accounts_payable",
        jsType: "number",
        fieldId: 2539,
        tableId: 274,
        baseType: "type/Decimal"
      },
      // Display name: Payable ID
      payableId: {
        type: "column",
        name: "payable_id",
        sourceName: "finance_accounts_payable",
        jsType: "number",
        fieldId: 2532,
        tableId: 274,
        baseType: "type/BigInteger"
      },
      // Display name: Vendor Name
      vendorName: {
        type: "column",
        name: "vendor_name",
        sourceName: "finance_accounts_payable",
        jsType: "string",
        fieldId: 2533,
        tableId: 274,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_accounts_receivable
  financeAccountsReceivable: {
    type: "table",
    id: 275,
    name: "Finance Accounts Receivable",
    fields: {
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "finance_accounts_receivable",
        jsType: "string",
        fieldId: 2541,
        tableId: 275,
        baseType: "type/Text"
      },
      // Display name: Due Date
      dueDate: {
        type: "column",
        name: "due_date",
        sourceName: "finance_accounts_receivable",
        jsType: "Date",
        fieldId: 2544,
        tableId: 275,
        baseType: "type/Date"
      },
      // Display name: Invoice Date
      invoiceDate: {
        type: "column",
        name: "invoice_date",
        sourceName: "finance_accounts_receivable",
        jsType: "Date",
        fieldId: 2543,
        tableId: 275,
        baseType: "type/Date"
      },
      // Display name: Invoice Number
      invoiceNumber: {
        type: "column",
        name: "invoice_number",
        sourceName: "finance_accounts_receivable",
        jsType: "string",
        fieldId: 2542,
        tableId: 275,
        baseType: "type/Text"
      },
      // Display name: Invoice Total
      invoiceTotal: {
        type: "column",
        name: "invoice_total",
        sourceName: "finance_accounts_receivable",
        jsType: "number",
        fieldId: 2546,
        tableId: 275,
        baseType: "type/Decimal"
      },
      // Display name: Open Balance
      openBalance: {
        type: "column",
        name: "open_balance",
        sourceName: "finance_accounts_receivable",
        jsType: "number",
        fieldId: 2547,
        tableId: 275,
        baseType: "type/Decimal"
      },
      // Display name: Receivable ID
      receivableId: {
        type: "column",
        name: "receivable_id",
        sourceName: "finance_accounts_receivable",
        jsType: "number",
        fieldId: 2540,
        tableId: 275,
        baseType: "type/BigInteger"
      },
      // Display name: Receivable Status
      receivableStatus: {
        type: "column",
        name: "receivable_status",
        sourceName: "finance_accounts_receivable",
        jsType: "string",
        fieldId: 2545,
        tableId: 275,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_budgets_wide
  financeBudgetsWide: {
    type: "table",
    id: 276,
    name: "Finance Budgets Wide",
    fields: {
      // Display name: Account Name
      accountName: {
        type: "column",
        name: "account_name",
        sourceName: "finance_budgets_wide",
        jsType: "string",
        fieldId: 2551,
        tableId: 276,
        baseType: "type/Text"
      },
      // Display name: Budget Amount
      budgetAmount: {
        type: "column",
        name: "budget_amount",
        sourceName: "finance_budgets_wide",
        jsType: "number",
        fieldId: 2553,
        tableId: 276,
        baseType: "type/Decimal"
      },
      // Display name: Budget ID
      budgetId: {
        type: "column",
        name: "budget_id",
        sourceName: "finance_budgets_wide",
        jsType: "number",
        fieldId: 2548,
        tableId: 276,
        baseType: "type/BigInteger"
      },
      // Display name: Budget Period
      budgetPeriod: {
        type: "column",
        name: "budget_period",
        sourceName: "finance_budgets_wide",
        jsType: "string",
        fieldId: 2552,
        tableId: 276,
        baseType: "type/Text"
      },
      // Display name: Department Name
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "finance_budgets_wide",
        jsType: "string",
        fieldId: 2550,
        tableId: 276,
        baseType: "type/Text"
      },
      // Display name: Fiscal Year
      fiscalYear: {
        type: "column",
        name: "fiscal_year",
        sourceName: "finance_budgets_wide",
        jsType: "number",
        fieldId: 2549,
        tableId: 276,
        baseType: "type/Integer"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_chart_of_accounts
  financeChartOfAccounts: {
    type: "table",
    id: 277,
    name: "Finance Chart Of Accounts",
    fields: {
      // Display name: Account Code
      accountCode: {
        type: "column",
        name: "account_code",
        sourceName: "finance_chart_of_accounts",
        jsType: "string",
        fieldId: 2555,
        tableId: 277,
        baseType: "type/Text"
      },
      // Display name: Account ID
      accountId: {
        type: "column",
        name: "account_id",
        sourceName: "finance_chart_of_accounts",
        jsType: "number",
        fieldId: 2554,
        tableId: 277,
        baseType: "type/BigInteger"
      },
      // Display name: Account Name
      accountName: {
        type: "column",
        name: "account_name",
        sourceName: "finance_chart_of_accounts",
        jsType: "string",
        fieldId: 2556,
        tableId: 277,
        baseType: "type/Text"
      },
      // Display name: Account Type
      accountType: {
        type: "column",
        name: "account_type",
        sourceName: "finance_chart_of_accounts",
        jsType: "string",
        fieldId: 2557,
        tableId: 277,
        baseType: "type/Text"
      },
      // Display name: Is Active
      isActive: {
        type: "column",
        name: "is_active",
        sourceName: "finance_chart_of_accounts",
        jsType: "boolean",
        fieldId: 2559,
        tableId: 277,
        baseType: "type/Boolean"
      },
      // Display name: Parent Account Code
      parentAccountCode: {
        type: "column",
        name: "parent_account_code",
        sourceName: "finance_chart_of_accounts",
        jsType: "string",
        fieldId: 2558,
        tableId: 277,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_cost_center_allocations
  financeCostCenterAllocations: {
    type: "table",
    id: 278,
    name: "Finance Cost Center Allocations",
    fields: {
      // Display name: Allocated Amount
      allocatedAmount: {
        type: "column",
        name: "allocated_amount",
        sourceName: "finance_cost_center_allocations",
        jsType: "number",
        fieldId: 2565,
        tableId: 278,
        baseType: "type/Decimal"
      },
      // Display name: Allocation ID
      allocationId: {
        type: "column",
        name: "allocation_id",
        sourceName: "finance_cost_center_allocations",
        jsType: "number",
        fieldId: 2560,
        tableId: 278,
        baseType: "type/BigInteger"
      },
      // Display name: Allocation Pct
      allocationPct: {
        type: "column",
        name: "allocation_pct",
        sourceName: "finance_cost_center_allocations",
        jsType: "number",
        fieldId: 2564,
        tableId: 278,
        baseType: "type/Decimal"
      },
      // Display name: Allocation Period
      allocationPeriod: {
        type: "column",
        name: "allocation_period",
        sourceName: "finance_cost_center_allocations",
        jsType: "string",
        fieldId: 2563,
        tableId: 278,
        baseType: "type/Text"
      },
      // Display name: Cost Center Name
      costCenterName: {
        type: "column",
        name: "cost_center_name",
        sourceName: "finance_cost_center_allocations",
        jsType: "string",
        fieldId: 2561,
        tableId: 278,
        baseType: "type/Text"
      },
      // Display name: Department Name
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "finance_cost_center_allocations",
        jsType: "string",
        fieldId: 2562,
        tableId: 278,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_expense_reports
  financeExpenseReports: {
    type: "table",
    id: 279,
    name: "Finance Expense Reports",
    fields: {
      // Display name: Employee Name
      employeeName: {
        type: "column",
        name: "employee_name",
        sourceName: "finance_expense_reports",
        jsType: "string",
        fieldId: 2567,
        tableId: 279,
        baseType: "type/Text"
      },
      // Display name: Expense Amount
      expenseAmount: {
        type: "column",
        name: "expense_amount",
        sourceName: "finance_expense_reports",
        jsType: "number",
        fieldId: 2571,
        tableId: 279,
        baseType: "type/Decimal"
      },
      // Display name: Expense Category
      expenseCategory: {
        type: "column",
        name: "expense_category",
        sourceName: "finance_expense_reports",
        jsType: "string",
        fieldId: 2569,
        tableId: 279,
        baseType: "type/Text"
      },
      // Display name: Expense Report ID
      expenseReportId: {
        type: "column",
        name: "expense_report_id",
        sourceName: "finance_expense_reports",
        jsType: "number",
        fieldId: 2566,
        tableId: 279,
        baseType: "type/BigInteger"
      },
      // Display name: Merchant Name
      merchantName: {
        type: "column",
        name: "merchant_name",
        sourceName: "finance_expense_reports",
        jsType: "string",
        fieldId: 2570,
        tableId: 279,
        baseType: "type/Text"
      },
      // Display name: Report Status
      reportStatus: {
        type: "column",
        name: "report_status",
        sourceName: "finance_expense_reports",
        jsType: "string",
        fieldId: 2572,
        tableId: 279,
        baseType: "type/Text"
      },
      // Display name: Submitted Date
      submittedDate: {
        type: "column",
        name: "submitted_date",
        sourceName: "finance_expense_reports",
        jsType: "Date",
        fieldId: 2568,
        tableId: 279,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_fixed_assets
  financeFixedAssets: {
    type: "table",
    id: 280,
    name: "Finance Fixed Assets",
    fields: {
      // Display name: Accumulated Depreciation Amount
      accumulatedDepreciationAmount: {
        type: "column",
        name: "accumulated_depreciation_amount",
        sourceName: "finance_fixed_assets",
        jsType: "number",
        fieldId: 2579,
        tableId: 280,
        baseType: "type/Decimal"
      },
      // Display name: Asset Class
      assetClass: {
        type: "column",
        name: "asset_class",
        sourceName: "finance_fixed_assets",
        jsType: "string",
        fieldId: 2575,
        tableId: 280,
        baseType: "type/Text"
      },
      // Display name: Asset ID
      assetId: {
        type: "column",
        name: "asset_id",
        sourceName: "finance_fixed_assets",
        jsType: "number",
        fieldId: 2573,
        tableId: 280,
        baseType: "type/BigInteger"
      },
      // Display name: Asset Name
      assetName: {
        type: "column",
        name: "asset_name",
        sourceName: "finance_fixed_assets",
        jsType: "string",
        fieldId: 2574,
        tableId: 280,
        baseType: "type/Text"
      },
      // Display name: Depreciation Method
      depreciationMethod: {
        type: "column",
        name: "depreciation_method",
        sourceName: "finance_fixed_assets",
        jsType: "string",
        fieldId: 2578,
        tableId: 280,
        baseType: "type/Text"
      },
      // Display name: Net Book Value
      netBookValue: {
        type: "column",
        name: "net_book_value",
        sourceName: "finance_fixed_assets",
        jsType: "number",
        fieldId: 2580,
        tableId: 280,
        baseType: "type/Decimal"
      },
      // Display name: Purchase Cost
      purchaseCost: {
        type: "column",
        name: "purchase_cost",
        sourceName: "finance_fixed_assets",
        jsType: "number",
        fieldId: 2577,
        tableId: 280,
        baseType: "type/Decimal"
      },
      // Display name: Purchase Date
      purchaseDate: {
        type: "column",
        name: "purchase_date",
        sourceName: "finance_fixed_assets",
        jsType: "Date",
        fieldId: 2576,
        tableId: 280,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_forecasts_wide
  financeForecastsWide: {
    type: "table",
    id: 281,
    name: "Finance Forecasts Wide",
    fields: {
      // Display name: Account Name
      accountName: {
        type: "column",
        name: "account_name",
        sourceName: "finance_forecasts_wide",
        jsType: "string",
        fieldId: 2584,
        tableId: 281,
        baseType: "type/Text"
      },
      // Display name: Department Name
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "finance_forecasts_wide",
        jsType: "string",
        fieldId: 2583,
        tableId: 281,
        baseType: "type/Text"
      },
      // Display name: Forecast Amount
      forecastAmount: {
        type: "column",
        name: "forecast_amount",
        sourceName: "finance_forecasts_wide",
        jsType: "number",
        fieldId: 2586,
        tableId: 281,
        baseType: "type/Decimal"
      },
      // Display name: Forecast ID
      forecastId: {
        type: "column",
        name: "forecast_id",
        sourceName: "finance_forecasts_wide",
        jsType: "number",
        fieldId: 2581,
        tableId: 281,
        baseType: "type/BigInteger"
      },
      // Display name: Forecast Period
      forecastPeriod: {
        type: "column",
        name: "forecast_period",
        sourceName: "finance_forecasts_wide",
        jsType: "string",
        fieldId: 2585,
        tableId: 281,
        baseType: "type/Text"
      },
      // Display name: Forecast Version
      forecastVersion: {
        type: "column",
        name: "forecast_version",
        sourceName: "finance_forecasts_wide",
        jsType: "string",
        fieldId: 2582,
        tableId: 281,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_fx_rates_daily
  financeFxRatesDaily: {
    type: "table",
    id: 282,
    name: "Finance Fx Rates Daily",
    fields: {
      // Display name: Exchange Rate
      exchangeRate: {
        type: "column",
        name: "exchange_rate",
        sourceName: "finance_fx_rates_daily",
        jsType: "number",
        fieldId: 2591,
        tableId: 282,
        baseType: "type/Decimal"
      },
      // Display name: From Currency Code
      fromCurrencyCode: {
        type: "column",
        name: "from_currency_code",
        sourceName: "finance_fx_rates_daily",
        jsType: "string",
        fieldId: 2589,
        tableId: 282,
        baseType: "type/Text"
      },
      // Display name: Fx Rate ID
      fxRateId: {
        type: "column",
        name: "fx_rate_id",
        sourceName: "finance_fx_rates_daily",
        jsType: "number",
        fieldId: 2587,
        tableId: 282,
        baseType: "type/BigInteger"
      },
      // Display name: Rate Date
      rateDate: {
        type: "column",
        name: "rate_date",
        sourceName: "finance_fx_rates_daily",
        jsType: "Date",
        fieldId: 2588,
        tableId: 282,
        baseType: "type/Date"
      },
      // Display name: To Currency Code
      toCurrencyCode: {
        type: "column",
        name: "to_currency_code",
        sourceName: "finance_fx_rates_daily",
        jsType: "string",
        fieldId: 2590,
        tableId: 282,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: finance_gl_entries_wide
  financeGlEntriesWide: {
    type: "table",
    id: 283,
    name: "Finance Gl Entries Wide",
    fields: {
      // Display name: Account Code
      accountCode: {
        type: "column",
        name: "account_code",
        sourceName: "finance_gl_entries_wide",
        jsType: "string",
        fieldId: 2594,
        tableId: 283,
        baseType: "type/Text"
      },
      // Display name: Account Name
      accountName: {
        type: "column",
        name: "account_name",
        sourceName: "finance_gl_entries_wide",
        jsType: "string",
        fieldId: 2595,
        tableId: 283,
        baseType: "type/Text"
      },
      // Display name: Cost Center Name
      costCenterName: {
        type: "column",
        name: "cost_center_name",
        sourceName: "finance_gl_entries_wide",
        jsType: "string",
        fieldId: 2596,
        tableId: 283,
        baseType: "type/Text"
      },
      // Display name: Credit Amount
      creditAmount: {
        type: "column",
        name: "credit_amount",
        sourceName: "finance_gl_entries_wide",
        jsType: "number",
        fieldId: 2599,
        tableId: 283,
        baseType: "type/Decimal"
      },
      // Display name: Currency Code
      currencyCode: {
        type: "column",
        name: "currency_code",
        sourceName: "finance_gl_entries_wide",
        jsType: "string",
        fieldId: 2600,
        tableId: 283,
        baseType: "type/Text"
      },
      // Display name: Debit Amount
      debitAmount: {
        type: "column",
        name: "debit_amount",
        sourceName: "finance_gl_entries_wide",
        jsType: "number",
        fieldId: 2598,
        tableId: 283,
        baseType: "type/Decimal"
      },
      // Display name: Department Name
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "finance_gl_entries_wide",
        jsType: "string",
        fieldId: 2597,
        tableId: 283,
        baseType: "type/Text"
      },
      // Display name: Gl Entry ID
      glEntryId: {
        type: "column",
        name: "gl_entry_id",
        sourceName: "finance_gl_entries_wide",
        jsType: "number",
        fieldId: 2592,
        tableId: 283,
        baseType: "type/BigInteger"
      },
      // Display name: Memo Text
      memoText: {
        type: "column",
        name: "memo_text",
        sourceName: "finance_gl_entries_wide",
        jsType: "string",
        fieldId: 2601,
        tableId: 283,
        baseType: "type/Text"
      },
      // Display name: Posting Date
      postingDate: {
        type: "column",
        name: "posting_date",
        sourceName: "finance_gl_entries_wide",
        jsType: "Date",
        fieldId: 2593,
        tableId: 283,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_applications_wide
  hrApplicationsWide: {
    type: "table",
    id: 284,
    name: "Hr Applications Wide",
    fields: {
      // Display name: Application ID
      applicationId: {
        type: "column",
        name: "application_id",
        sourceName: "hr_applications_wide",
        jsType: "number",
        fieldId: 2602,
        tableId: 284,
        baseType: "type/BigInteger"
      },
      // Display name: Application Status
      applicationStatus: {
        type: "column",
        name: "application_status",
        sourceName: "hr_applications_wide",
        jsType: "string",
        fieldId: 2607,
        tableId: 284,
        baseType: "type/Text"
      },
      // Display name: Applied Date
      appliedDate: {
        type: "column",
        name: "applied_date",
        sourceName: "hr_applications_wide",
        jsType: "Date",
        fieldId: 2605,
        tableId: 284,
        baseType: "type/Date"
      },
      // Display name: Candidate ID
      candidateId: {
        type: "column",
        name: "candidate_id",
        sourceName: "hr_applications_wide",
        jsType: "number",
        fieldId: 2603,
        tableId: 284,
        baseType: "type/BigInteger"
      },
      // Display name: Recruiter Name
      recruiterName: {
        type: "column",
        name: "recruiter_name",
        sourceName: "hr_applications_wide",
        jsType: "string",
        fieldId: 2608,
        tableId: 284,
        baseType: "type/Text"
      },
      // Display name: Requisition ID
      requisitionId: {
        type: "column",
        name: "requisition_id",
        sourceName: "hr_applications_wide",
        jsType: "number",
        fieldId: 2604,
        tableId: 284,
        baseType: "type/BigInteger"
      },
      // Display name: Stage Name
      stageName: {
        type: "column",
        name: "stage_name",
        sourceName: "hr_applications_wide",
        jsType: "string",
        fieldId: 2606,
        tableId: 284,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_candidates_wide
  hrCandidatesWide: {
    type: "table",
    id: 285,
    name: "Hr Candidates Wide",
    fields: {
      // Display name: Candidate ID
      candidateId: {
        type: "column",
        name: "candidate_id",
        sourceName: "hr_candidates_wide",
        jsType: "number",
        fieldId: 2609,
        tableId: 285,
        baseType: "type/BigInteger"
      },
      // Display name: Created Date
      createdDate: {
        type: "column",
        name: "created_date",
        sourceName: "hr_candidates_wide",
        jsType: "Date",
        fieldId: 2614,
        tableId: 285,
        baseType: "type/Date"
      },
      // Display name: Current Employer
      currentEmployer: {
        type: "column",
        name: "current_employer",
        sourceName: "hr_candidates_wide",
        jsType: "string",
        fieldId: 2613,
        tableId: 285,
        baseType: "type/Text"
      },
      // Display name: Email
      email: {
        type: "column",
        name: "email",
        sourceName: "hr_candidates_wide",
        jsType: "string",
        fieldId: 2611,
        tableId: 285,
        baseType: "type/Text"
      },
      // Display name: Full Name
      fullName: {
        type: "column",
        name: "full_name",
        sourceName: "hr_candidates_wide",
        jsType: "string",
        fieldId: 2610,
        tableId: 285,
        baseType: "type/Text"
      },
      // Display name: Source Name
      sourceName: {
        type: "column",
        name: "source_name",
        sourceName: "hr_candidates_wide",
        jsType: "string",
        fieldId: 2612,
        tableId: 285,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_departments_wide
  hrDepartmentsWide: {
    type: "table",
    id: 286,
    name: "Hr Departments Wide",
    fields: {
      // Display name: Cost Center Code
      costCenterCode: {
        type: "column",
        name: "cost_center_code",
        sourceName: "hr_departments_wide",
        jsType: "string",
        fieldId: 2619,
        tableId: 286,
        baseType: "type/Text"
      },
      // Display name: Department ID
      departmentId: {
        type: "column",
        name: "department_id",
        sourceName: "hr_departments_wide",
        jsType: "number",
        fieldId: 2615,
        tableId: 286,
        baseType: "type/BigInteger"
      },
      // Display name: Department Name
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "hr_departments_wide",
        jsType: "string",
        fieldId: 2616,
        tableId: 286,
        baseType: "type/Text"
      },
      // Display name: Head Name
      headName: {
        type: "column",
        name: "head_name",
        sourceName: "hr_departments_wide",
        jsType: "string",
        fieldId: 2618,
        tableId: 286,
        baseType: "type/Text"
      },
      // Display name: Headcount Count
      headcountCount: {
        type: "column",
        name: "headcount_count",
        sourceName: "hr_departments_wide",
        jsType: "number",
        fieldId: 2620,
        tableId: 286,
        baseType: "type/Integer"
      },
      // Display name: Parent Department Name
      parentDepartmentName: {
        type: "column",
        name: "parent_department_name",
        sourceName: "hr_departments_wide",
        jsType: "string",
        fieldId: 2617,
        tableId: 286,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_employees_wide
  hrEmployeesWide: {
    type: "table",
    id: 287,
    name: "Hr Employees Wide",
    fields: {
      // Display name: Department Name
      // Semantic type: type/Category
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "hr_employees_wide",
        jsType: "string",
        fieldId: 2626,
        tableId: 287,
        baseType: "type/Text"
      },
      // Display name: Email
      // Semantic type: type/Email
      email: {
        type: "column",
        name: "email",
        sourceName: "hr_employees_wide",
        jsType: "string",
        fieldId: 2623,
        tableId: 287,
        baseType: "type/Text"
      },
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "hr_employees_wide",
        jsType: "number",
        fieldId: 2621,
        tableId: 287,
        baseType: "type/BigInteger"
      },
      // Display name: Employment Type
      // Semantic type: type/Category
      employmentType: {
        type: "column",
        name: "employment_type",
        sourceName: "hr_employees_wide",
        jsType: "string",
        fieldId: 2629,
        tableId: 287,
        baseType: "type/Text"
      },
      // Display name: Full Name
      // Semantic type: type/Name
      fullName: {
        type: "column",
        name: "full_name",
        sourceName: "hr_employees_wide",
        jsType: "string",
        fieldId: 2622,
        tableId: 287,
        baseType: "type/Text"
      },
      // Display name: Hire Date
      hireDate: {
        type: "column",
        name: "hire_date",
        sourceName: "hr_employees_wide",
        jsType: "Date",
        fieldId: 2624,
        tableId: 287,
        baseType: "type/Date"
      },
      // Display name: Is Active
      isActive: {
        type: "column",
        name: "is_active",
        sourceName: "hr_employees_wide",
        jsType: "boolean",
        fieldId: 2630,
        tableId: 287,
        baseType: "type/Boolean"
      },
      // Display name: Job Title
      // Semantic type: type/Title
      jobTitle: {
        type: "column",
        name: "job_title",
        sourceName: "hr_employees_wide",
        jsType: "string",
        fieldId: 2625,
        tableId: 287,
        baseType: "type/Text"
      },
      // Display name: Location Name
      // Semantic type: type/Category
      locationName: {
        type: "column",
        name: "location_name",
        sourceName: "hr_employees_wide",
        jsType: "string",
        fieldId: 2628,
        tableId: 287,
        baseType: "type/Text"
      },
      // Display name: Manager Name
      // Semantic type: type/Category
      managerName: {
        type: "column",
        name: "manager_name",
        sourceName: "hr_employees_wide",
        jsType: "string",
        fieldId: 2627,
        tableId: 287,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_interviews_wide
  hrInterviewsWide: {
    type: "table",
    id: 288,
    name: "Hr Interviews Wide",
    fields: {
      // Display name: Application ID
      applicationId: {
        type: "column",
        name: "application_id",
        sourceName: "hr_interviews_wide",
        jsType: "number",
        fieldId: 2632,
        tableId: 288,
        baseType: "type/BigInteger"
      },
      // Display name: Interview Date
      interviewDate: {
        type: "column",
        name: "interview_date",
        sourceName: "hr_interviews_wide",
        jsType: "Date",
        fieldId: 2633,
        tableId: 288,
        baseType: "type/Date"
      },
      // Display name: Interview ID
      interviewId: {
        type: "column",
        name: "interview_id",
        sourceName: "hr_interviews_wide",
        jsType: "number",
        fieldId: 2631,
        tableId: 288,
        baseType: "type/BigInteger"
      },
      // Display name: Interview Type
      interviewType: {
        type: "column",
        name: "interview_type",
        sourceName: "hr_interviews_wide",
        jsType: "string",
        fieldId: 2635,
        tableId: 288,
        baseType: "type/Text"
      },
      // Display name: Interviewer Name
      interviewerName: {
        type: "column",
        name: "interviewer_name",
        sourceName: "hr_interviews_wide",
        jsType: "string",
        fieldId: 2634,
        tableId: 288,
        baseType: "type/Text"
      },
      // Display name: Recommendation
      recommendation: {
        type: "column",
        name: "recommendation",
        sourceName: "hr_interviews_wide",
        jsType: "string",
        fieldId: 2637,
        tableId: 288,
        baseType: "type/Text"
      },
      // Display name: Score Value
      scoreValue: {
        type: "column",
        name: "score_value",
        sourceName: "hr_interviews_wide",
        jsType: "number",
        fieldId: 2636,
        tableId: 288,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_job_requisitions
  hrJobRequisitions: {
    type: "table",
    id: 289,
    name: "Hr Job Requisitions",
    fields: {
      // Display name: Closed Date
      closedDate: {
        type: "column",
        name: "closed_date",
        sourceName: "hr_job_requisitions",
        jsType: "Date",
        fieldId: 2643,
        tableId: 289,
        baseType: "type/Date"
      },
      // Display name: Department Name
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "hr_job_requisitions",
        jsType: "string",
        fieldId: 2640,
        tableId: 289,
        baseType: "type/Text"
      },
      // Display name: Hiring Manager Name
      hiringManagerName: {
        type: "column",
        name: "hiring_manager_name",
        sourceName: "hr_job_requisitions",
        jsType: "string",
        fieldId: 2641,
        tableId: 289,
        baseType: "type/Text"
      },
      // Display name: Job Title
      jobTitle: {
        type: "column",
        name: "job_title",
        sourceName: "hr_job_requisitions",
        jsType: "string",
        fieldId: 2639,
        tableId: 289,
        baseType: "type/Text"
      },
      // Display name: Opened Date
      openedDate: {
        type: "column",
        name: "opened_date",
        sourceName: "hr_job_requisitions",
        jsType: "Date",
        fieldId: 2642,
        tableId: 289,
        baseType: "type/Date"
      },
      // Display name: Requisition ID
      requisitionId: {
        type: "column",
        name: "requisition_id",
        sourceName: "hr_job_requisitions",
        jsType: "number",
        fieldId: 2638,
        tableId: 289,
        baseType: "type/BigInteger"
      },
      // Display name: Requisition Status
      requisitionStatus: {
        type: "column",
        name: "requisition_status",
        sourceName: "hr_job_requisitions",
        jsType: "string",
        fieldId: 2644,
        tableId: 289,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_offers_wide
  hrOffersWide: {
    type: "table",
    id: 290,
    name: "Hr Offers Wide",
    fields: {
      // Display name: Accepted Date
      acceptedDate: {
        type: "column",
        name: "accepted_date",
        sourceName: "hr_offers_wide",
        jsType: "Date",
        fieldId: 2650,
        tableId: 290,
        baseType: "type/Date"
      },
      // Display name: Application ID
      applicationId: {
        type: "column",
        name: "application_id",
        sourceName: "hr_offers_wide",
        jsType: "number",
        fieldId: 2646,
        tableId: 290,
        baseType: "type/BigInteger"
      },
      // Display name: Offer Date
      offerDate: {
        type: "column",
        name: "offer_date",
        sourceName: "hr_offers_wide",
        jsType: "Date",
        fieldId: 2647,
        tableId: 290,
        baseType: "type/Date"
      },
      // Display name: Offer ID
      offerId: {
        type: "column",
        name: "offer_id",
        sourceName: "hr_offers_wide",
        jsType: "number",
        fieldId: 2645,
        tableId: 290,
        baseType: "type/BigInteger"
      },
      // Display name: Offer Status
      offerStatus: {
        type: "column",
        name: "offer_status",
        sourceName: "hr_offers_wide",
        jsType: "string",
        fieldId: 2649,
        tableId: 290,
        baseType: "type/Text"
      },
      // Display name: Salary Offered Amount
      salaryOfferedAmount: {
        type: "column",
        name: "salary_offered_amount",
        sourceName: "hr_offers_wide",
        jsType: "number",
        fieldId: 2648,
        tableId: 290,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_performance_reviews
  hrPerformanceReviews: {
    type: "table",
    id: 291,
    name: "Hr Performance Reviews",
    fields: {
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "hr_performance_reviews",
        jsType: "number",
        fieldId: 2652,
        tableId: 291,
        baseType: "type/BigInteger"
      },
      // Display name: Rating Score
      ratingScore: {
        type: "column",
        name: "rating_score",
        sourceName: "hr_performance_reviews",
        jsType: "number",
        fieldId: 2655,
        tableId: 291,
        baseType: "type/Decimal"
      },
      // Display name: Review ID
      reviewId: {
        type: "column",
        name: "review_id",
        sourceName: "hr_performance_reviews",
        jsType: "number",
        fieldId: 2651,
        tableId: 291,
        baseType: "type/BigInteger"
      },
      // Display name: Review Period
      reviewPeriod: {
        type: "column",
        name: "review_period",
        sourceName: "hr_performance_reviews",
        jsType: "string",
        fieldId: 2653,
        tableId: 291,
        baseType: "type/Text"
      },
      // Display name: Reviewed Date
      reviewedDate: {
        type: "column",
        name: "reviewed_date",
        sourceName: "hr_performance_reviews",
        jsType: "Date",
        fieldId: 2656,
        tableId: 291,
        baseType: "type/Date"
      },
      // Display name: Reviewer Name
      reviewerName: {
        type: "column",
        name: "reviewer_name",
        sourceName: "hr_performance_reviews",
        jsType: "string",
        fieldId: 2654,
        tableId: 291,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_positions_wide
  hrPositionsWide: {
    type: "table",
    id: 292,
    name: "Hr Positions Wide",
    fields: {
      // Display name: Department Name
      departmentName: {
        type: "column",
        name: "department_name",
        sourceName: "hr_positions_wide",
        jsType: "string",
        fieldId: 2659,
        tableId: 292,
        baseType: "type/Text"
      },
      // Display name: Is Open
      isOpen: {
        type: "column",
        name: "is_open",
        sourceName: "hr_positions_wide",
        jsType: "boolean",
        fieldId: 2663,
        tableId: 292,
        baseType: "type/Boolean"
      },
      // Display name: Job Level
      jobLevel: {
        type: "column",
        name: "job_level",
        sourceName: "hr_positions_wide",
        jsType: "string",
        fieldId: 2660,
        tableId: 292,
        baseType: "type/Text"
      },
      // Display name: Job Title
      jobTitle: {
        type: "column",
        name: "job_title",
        sourceName: "hr_positions_wide",
        jsType: "string",
        fieldId: 2658,
        tableId: 292,
        baseType: "type/Text"
      },
      // Display name: Max Salary
      maxSalary: {
        type: "column",
        name: "max_salary",
        sourceName: "hr_positions_wide",
        jsType: "number",
        fieldId: 2662,
        tableId: 292,
        baseType: "type/Decimal"
      },
      // Display name: Min Salary
      minSalary: {
        type: "column",
        name: "min_salary",
        sourceName: "hr_positions_wide",
        jsType: "number",
        fieldId: 2661,
        tableId: 292,
        baseType: "type/Decimal"
      },
      // Display name: Position ID
      positionId: {
        type: "column",
        name: "position_id",
        sourceName: "hr_positions_wide",
        jsType: "number",
        fieldId: 2657,
        tableId: 292,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: hr_terminations_wide
  hrTerminationsWide: {
    type: "table",
    id: 293,
    name: "Hr Terminations Wide",
    fields: {
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "hr_terminations_wide",
        jsType: "number",
        fieldId: 2665,
        tableId: 293,
        baseType: "type/BigInteger"
      },
      // Display name: Exit Interview Score
      exitInterviewScore: {
        type: "column",
        name: "exit_interview_score",
        sourceName: "hr_terminations_wide",
        jsType: "number",
        fieldId: 2670,
        tableId: 293,
        baseType: "type/Decimal"
      },
      // Display name: Is Regretted
      isRegretted: {
        type: "column",
        name: "is_regretted",
        sourceName: "hr_terminations_wide",
        jsType: "boolean",
        fieldId: 2669,
        tableId: 293,
        baseType: "type/Boolean"
      },
      // Display name: Reason Name
      reasonName: {
        type: "column",
        name: "reason_name",
        sourceName: "hr_terminations_wide",
        jsType: "string",
        fieldId: 2668,
        tableId: 293,
        baseType: "type/Text"
      },
      // Display name: Termination Date
      terminationDate: {
        type: "column",
        name: "termination_date",
        sourceName: "hr_terminations_wide",
        jsType: "Date",
        fieldId: 2666,
        tableId: 293,
        baseType: "type/Date"
      },
      // Display name: Termination ID
      terminationId: {
        type: "column",
        name: "termination_id",
        sourceName: "hr_terminations_wide",
        jsType: "number",
        fieldId: 2664,
        tableId: 293,
        baseType: "type/BigInteger"
      },
      // Display name: Termination Type
      terminationType: {
        type: "column",
        name: "termination_type",
        sourceName: "hr_terminations_wide",
        jsType: "string",
        fieldId: 2667,
        tableId: 293,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: import_jobs
  importJobs: {
    type: "table",
    id: 268,
    name: "Import Jobs",
    fields: {
      // Display name: Finished At
      finishedAt: {
        type: "column",
        name: "finished_at",
        sourceName: "import_jobs",
        jsType: "Date",
        fieldId: 2263,
        tableId: 268,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Job ID
      jobId: {
        type: "column",
        name: "job_id",
        sourceName: "import_jobs",
        jsType: "number",
        fieldId: 2258,
        tableId: 268,
        baseType: "type/BigInteger"
      },
      // Display name: Rows Loaded
      rowsLoaded: {
        type: "column",
        name: "rows_loaded",
        sourceName: "import_jobs",
        jsType: "number",
        fieldId: 2261,
        tableId: 268,
        baseType: "type/Integer"
      },
      // Display name: Source Name
      sourceName: {
        type: "column",
        name: "source_name",
        sourceName: "import_jobs",
        jsType: "string",
        fieldId: 2259,
        tableId: 268,
        baseType: "type/Text"
      },
      // Display name: Started At
      startedAt: {
        type: "column",
        name: "started_at",
        sourceName: "import_jobs",
        jsType: "Date",
        fieldId: 2262,
        tableId: 268,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Status
      status: {
        type: "column",
        name: "status",
        sourceName: "import_jobs",
        jsType: "string",
        fieldId: 2260,
        tableId: 268,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_cycle_counts
  inventoryCycleCounts: {
    type: "table",
    id: 294,
    name: "Inventory Cycle Counts",
    fields: {
      // Display name: Count Date
      countDate: {
        type: "column",
        name: "count_date",
        sourceName: "inventory_cycle_counts",
        jsType: "Date",
        fieldId: 2672,
        tableId: 294,
        baseType: "type/Date"
      },
      // Display name: Counted Quantity
      countedQuantity: {
        type: "column",
        name: "counted_quantity",
        sourceName: "inventory_cycle_counts",
        jsType: "number",
        fieldId: 2676,
        tableId: 294,
        baseType: "type/Integer"
      },
      // Display name: Cycle Count ID
      cycleCountId: {
        type: "column",
        name: "cycle_count_id",
        sourceName: "inventory_cycle_counts",
        jsType: "number",
        fieldId: 2671,
        tableId: 294,
        baseType: "type/BigInteger"
      },
      // Display name: Expected Quantity
      expectedQuantity: {
        type: "column",
        name: "expected_quantity",
        sourceName: "inventory_cycle_counts",
        jsType: "number",
        fieldId: 2675,
        tableId: 294,
        baseType: "type/Integer"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "inventory_cycle_counts",
        jsType: "string",
        fieldId: 2674,
        tableId: 294,
        baseType: "type/Text"
      },
      // Display name: Variance Quantity
      varianceQuantity: {
        type: "column",
        name: "variance_quantity",
        sourceName: "inventory_cycle_counts",
        jsType: "number",
        fieldId: 2677,
        tableId: 294,
        baseType: "type/Integer"
      },
      // Display name: Warehouse Name
      warehouseName: {
        type: "column",
        name: "warehouse_name",
        sourceName: "inventory_cycle_counts",
        jsType: "string",
        fieldId: 2673,
        tableId: 294,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_movements_wide
  inventoryMovementsWide: {
    type: "table",
    id: 295,
    name: "Inventory Movements Wide",
    fields: {
      // Display name: Movement Date
      movementDate: {
        type: "column",
        name: "movement_date",
        sourceName: "inventory_movements_wide",
        jsType: "Date",
        fieldId: 2679,
        tableId: 295,
        baseType: "type/Date"
      },
      // Display name: Movement ID
      movementId: {
        type: "column",
        name: "movement_id",
        sourceName: "inventory_movements_wide",
        jsType: "number",
        fieldId: 2678,
        tableId: 295,
        baseType: "type/BigInteger"
      },
      // Display name: Movement Type
      movementType: {
        type: "column",
        name: "movement_type",
        sourceName: "inventory_movements_wide",
        jsType: "string",
        fieldId: 2682,
        tableId: 295,
        baseType: "type/Text"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "inventory_movements_wide",
        jsType: "string",
        fieldId: 2681,
        tableId: 295,
        baseType: "type/Text"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "inventory_movements_wide",
        jsType: "number",
        fieldId: 2683,
        tableId: 295,
        baseType: "type/Integer"
      },
      // Display name: Reference Number
      referenceNumber: {
        type: "column",
        name: "reference_number",
        sourceName: "inventory_movements_wide",
        jsType: "string",
        fieldId: 2684,
        tableId: 295,
        baseType: "type/Text"
      },
      // Display name: Unit Cost
      unitCost: {
        type: "column",
        name: "unit_cost",
        sourceName: "inventory_movements_wide",
        jsType: "number",
        fieldId: 2685,
        tableId: 295,
        baseType: "type/Decimal"
      },
      // Display name: Warehouse Name
      warehouseName: {
        type: "column",
        name: "warehouse_name",
        sourceName: "inventory_movements_wide",
        jsType: "string",
        fieldId: 2680,
        tableId: 295,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_products_wide
  inventoryProductsWide: {
    type: "table",
    id: 296,
    name: "Inventory Products Wide",
    fields: {
      // Display name: Brand Name
      brandName: {
        type: "column",
        name: "brand_name",
        sourceName: "inventory_products_wide",
        jsType: "string",
        fieldId: 2690,
        tableId: 296,
        baseType: "type/Text"
      },
      // Display name: Category Name
      categoryName: {
        type: "column",
        name: "category_name",
        sourceName: "inventory_products_wide",
        jsType: "string",
        fieldId: 2689,
        tableId: 296,
        baseType: "type/Text"
      },
      // Display name: Is Discontinued
      isDiscontinued: {
        type: "column",
        name: "is_discontinued",
        sourceName: "inventory_products_wide",
        jsType: "boolean",
        fieldId: 2694,
        tableId: 296,
        baseType: "type/Boolean"
      },
      // Display name: List Price
      listPrice: {
        type: "column",
        name: "list_price",
        sourceName: "inventory_products_wide",
        jsType: "number",
        fieldId: 2693,
        tableId: 296,
        baseType: "type/Decimal"
      },
      // Display name: Product ID
      productId: {
        type: "column",
        name: "product_id",
        sourceName: "inventory_products_wide",
        jsType: "number",
        fieldId: 2686,
        tableId: 296,
        baseType: "type/BigInteger"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "inventory_products_wide",
        jsType: "string",
        fieldId: 2688,
        tableId: 296,
        baseType: "type/Text"
      },
      // Display name: Sku Code
      skuCode: {
        type: "column",
        name: "sku_code",
        sourceName: "inventory_products_wide",
        jsType: "string",
        fieldId: 2687,
        tableId: 296,
        baseType: "type/Text"
      },
      // Display name: Supplier Name
      supplierName: {
        type: "column",
        name: "supplier_name",
        sourceName: "inventory_products_wide",
        jsType: "string",
        fieldId: 2691,
        tableId: 296,
        baseType: "type/Text"
      },
      // Display name: Unit Cost
      unitCost: {
        type: "column",
        name: "unit_cost",
        sourceName: "inventory_products_wide",
        jsType: "number",
        fieldId: 2692,
        tableId: 296,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_purchase_order_lines
  inventoryPurchaseOrderLines: {
    type: "table",
    id: 297,
    name: "Inventory Purchase Order Lines",
    fields: {
      // Display name: Line Total
      lineTotal: {
        type: "column",
        name: "line_total",
        sourceName: "inventory_purchase_order_lines",
        jsType: "number",
        fieldId: 2700,
        tableId: 297,
        baseType: "type/Decimal"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "inventory_purchase_order_lines",
        jsType: "string",
        fieldId: 2697,
        tableId: 297,
        baseType: "type/Text"
      },
      // Display name: Purchase Order ID
      purchaseOrderId: {
        type: "column",
        name: "purchase_order_id",
        sourceName: "inventory_purchase_order_lines",
        jsType: "number",
        fieldId: 2696,
        tableId: 297,
        baseType: "type/BigInteger"
      },
      // Display name: Purchase Order Line ID
      purchaseOrderLineId: {
        type: "column",
        name: "purchase_order_line_id",
        sourceName: "inventory_purchase_order_lines",
        jsType: "number",
        fieldId: 2695,
        tableId: 297,
        baseType: "type/BigInteger"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "inventory_purchase_order_lines",
        jsType: "number",
        fieldId: 2698,
        tableId: 297,
        baseType: "type/Integer"
      },
      // Display name: Unit Cost
      unitCost: {
        type: "column",
        name: "unit_cost",
        sourceName: "inventory_purchase_order_lines",
        jsType: "number",
        fieldId: 2699,
        tableId: 297,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_purchase_orders_wide
  inventoryPurchaseOrdersWide: {
    type: "table",
    id: 298,
    name: "Inventory Purchase Orders Wide",
    fields: {
      // Display name: Buyer Name
      buyerName: {
        type: "column",
        name: "buyer_name",
        sourceName: "inventory_purchase_orders_wide",
        jsType: "string",
        fieldId: 2704,
        tableId: 298,
        baseType: "type/Text"
      },
      // Display name: Expected Date
      expectedDate: {
        type: "column",
        name: "expected_date",
        sourceName: "inventory_purchase_orders_wide",
        jsType: "Date",
        fieldId: 2705,
        tableId: 298,
        baseType: "type/Date"
      },
      // Display name: Order Date
      orderDate: {
        type: "column",
        name: "order_date",
        sourceName: "inventory_purchase_orders_wide",
        jsType: "Date",
        fieldId: 2702,
        tableId: 298,
        baseType: "type/Date"
      },
      // Display name: Order Status
      orderStatus: {
        type: "column",
        name: "order_status",
        sourceName: "inventory_purchase_orders_wide",
        jsType: "string",
        fieldId: 2706,
        tableId: 298,
        baseType: "type/Text"
      },
      // Display name: Purchase Order ID
      purchaseOrderId: {
        type: "column",
        name: "purchase_order_id",
        sourceName: "inventory_purchase_orders_wide",
        jsType: "number",
        fieldId: 2701,
        tableId: 298,
        baseType: "type/BigInteger"
      },
      // Display name: Supplier Name
      supplierName: {
        type: "column",
        name: "supplier_name",
        sourceName: "inventory_purchase_orders_wide",
        jsType: "string",
        fieldId: 2703,
        tableId: 298,
        baseType: "type/Text"
      },
      // Display name: Total Amount
      totalAmount: {
        type: "column",
        name: "total_amount",
        sourceName: "inventory_purchase_orders_wide",
        jsType: "number",
        fieldId: 2707,
        tableId: 298,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_receipts_wide
  inventoryReceiptsWide: {
    type: "table",
    id: 299,
    name: "Inventory Receipts Wide",
    fields: {
      // Display name: Damaged Quantity
      damagedQuantity: {
        type: "column",
        name: "damaged_quantity",
        sourceName: "inventory_receipts_wide",
        jsType: "number",
        fieldId: 2714,
        tableId: 299,
        baseType: "type/Integer"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "inventory_receipts_wide",
        jsType: "string",
        fieldId: 2712,
        tableId: 299,
        baseType: "type/Text"
      },
      // Display name: Purchase Order ID
      purchaseOrderId: {
        type: "column",
        name: "purchase_order_id",
        sourceName: "inventory_receipts_wide",
        jsType: "number",
        fieldId: 2709,
        tableId: 299,
        baseType: "type/BigInteger"
      },
      // Display name: Receipt ID
      receiptId: {
        type: "column",
        name: "receipt_id",
        sourceName: "inventory_receipts_wide",
        jsType: "number",
        fieldId: 2708,
        tableId: 299,
        baseType: "type/BigInteger"
      },
      // Display name: Received Date
      receivedDate: {
        type: "column",
        name: "received_date",
        sourceName: "inventory_receipts_wide",
        jsType: "Date",
        fieldId: 2710,
        tableId: 299,
        baseType: "type/Date"
      },
      // Display name: Received Quantity
      receivedQuantity: {
        type: "column",
        name: "received_quantity",
        sourceName: "inventory_receipts_wide",
        jsType: "number",
        fieldId: 2713,
        tableId: 299,
        baseType: "type/Integer"
      },
      // Display name: Warehouse Name
      warehouseName: {
        type: "column",
        name: "warehouse_name",
        sourceName: "inventory_receipts_wide",
        jsType: "string",
        fieldId: 2711,
        tableId: 299,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_shipments_wide
  inventoryShipmentsWide: {
    type: "table",
    id: 300,
    name: "Inventory Shipments Wide",
    fields: {
      // Display name: Carrier Name
      carrierName: {
        type: "column",
        name: "carrier_name",
        sourceName: "inventory_shipments_wide",
        jsType: "string",
        fieldId: 2719,
        tableId: 300,
        baseType: "type/Text"
      },
      // Display name: Freight Cost
      freightCost: {
        type: "column",
        name: "freight_cost",
        sourceName: "inventory_shipments_wide",
        jsType: "number",
        fieldId: 2722,
        tableId: 300,
        baseType: "type/Decimal"
      },
      // Display name: Order ID
      orderId: {
        type: "column",
        name: "order_id",
        sourceName: "inventory_shipments_wide",
        jsType: "number",
        fieldId: 2716,
        tableId: 300,
        baseType: "type/BigInteger"
      },
      // Display name: Shipment ID
      shipmentId: {
        type: "column",
        name: "shipment_id",
        sourceName: "inventory_shipments_wide",
        jsType: "number",
        fieldId: 2715,
        tableId: 300,
        baseType: "type/BigInteger"
      },
      // Display name: Shipment Status
      shipmentStatus: {
        type: "column",
        name: "shipment_status",
        sourceName: "inventory_shipments_wide",
        jsType: "string",
        fieldId: 2721,
        tableId: 300,
        baseType: "type/Text"
      },
      // Display name: Shipped Date
      shippedDate: {
        type: "column",
        name: "shipped_date",
        sourceName: "inventory_shipments_wide",
        jsType: "Date",
        fieldId: 2717,
        tableId: 300,
        baseType: "type/Date"
      },
      // Display name: Tracking Number
      trackingNumber: {
        type: "column",
        name: "tracking_number",
        sourceName: "inventory_shipments_wide",
        jsType: "string",
        fieldId: 2720,
        tableId: 300,
        baseType: "type/Text"
      },
      // Display name: Warehouse Name
      warehouseName: {
        type: "column",
        name: "warehouse_name",
        sourceName: "inventory_shipments_wide",
        jsType: "string",
        fieldId: 2718,
        tableId: 300,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_stock_levels
  inventoryStockLevels: {
    type: "table",
    id: 301,
    name: "Inventory Stock Levels",
    fields: {
      // Display name: On Hand Quantity
      onHandQuantity: {
        type: "column",
        name: "on_hand_quantity",
        sourceName: "inventory_stock_levels",
        jsType: "number",
        fieldId: 2727,
        tableId: 301,
        baseType: "type/Integer"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "inventory_stock_levels",
        jsType: "string",
        fieldId: 2726,
        tableId: 301,
        baseType: "type/Text"
      },
      // Display name: Reorder Point Quantity
      reorderPointQuantity: {
        type: "column",
        name: "reorder_point_quantity",
        sourceName: "inventory_stock_levels",
        jsType: "number",
        fieldId: 2729,
        tableId: 301,
        baseType: "type/Integer"
      },
      // Display name: Reserved Quantity
      reservedQuantity: {
        type: "column",
        name: "reserved_quantity",
        sourceName: "inventory_stock_levels",
        jsType: "number",
        fieldId: 2728,
        tableId: 301,
        baseType: "type/Integer"
      },
      // Display name: Snapshot Date
      snapshotDate: {
        type: "column",
        name: "snapshot_date",
        sourceName: "inventory_stock_levels",
        jsType: "Date",
        fieldId: 2724,
        tableId: 301,
        baseType: "type/Date"
      },
      // Display name: Stock Level ID
      stockLevelId: {
        type: "column",
        name: "stock_level_id",
        sourceName: "inventory_stock_levels",
        jsType: "number",
        fieldId: 2723,
        tableId: 301,
        baseType: "type/BigInteger"
      },
      // Display name: Warehouse Name
      warehouseName: {
        type: "column",
        name: "warehouse_name",
        sourceName: "inventory_stock_levels",
        jsType: "string",
        fieldId: 2725,
        tableId: 301,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_suppliers_wide
  inventorySuppliersWide: {
    type: "table",
    id: 302,
    name: "Inventory Suppliers Wide",
    fields: {
      // Display name: Contact Name
      contactName: {
        type: "column",
        name: "contact_name",
        sourceName: "inventory_suppliers_wide",
        jsType: "string",
        fieldId: 2732,
        tableId: 302,
        baseType: "type/Text"
      },
      // Display name: Country Name
      countryName: {
        type: "column",
        name: "country_name",
        sourceName: "inventory_suppliers_wide",
        jsType: "string",
        fieldId: 2733,
        tableId: 302,
        baseType: "type/Text"
      },
      // Display name: Lead Time Days
      leadTimeDays: {
        type: "column",
        name: "lead_time_days",
        sourceName: "inventory_suppliers_wide",
        jsType: "number",
        fieldId: 2735,
        tableId: 302,
        baseType: "type/Integer"
      },
      // Display name: Payment Terms
      paymentTerms: {
        type: "column",
        name: "payment_terms",
        sourceName: "inventory_suppliers_wide",
        jsType: "string",
        fieldId: 2734,
        tableId: 302,
        baseType: "type/Text"
      },
      // Display name: Rating Score
      ratingScore: {
        type: "column",
        name: "rating_score",
        sourceName: "inventory_suppliers_wide",
        jsType: "number",
        fieldId: 2736,
        tableId: 302,
        baseType: "type/Decimal"
      },
      // Display name: Supplier ID
      supplierId: {
        type: "column",
        name: "supplier_id",
        sourceName: "inventory_suppliers_wide",
        jsType: "number",
        fieldId: 2730,
        tableId: 302,
        baseType: "type/BigInteger"
      },
      // Display name: Supplier Name
      supplierName: {
        type: "column",
        name: "supplier_name",
        sourceName: "inventory_suppliers_wide",
        jsType: "string",
        fieldId: 2731,
        tableId: 302,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: inventory_warehouses_wide
  inventoryWarehousesWide: {
    type: "table",
    id: 303,
    name: "Inventory Warehouses Wide",
    fields: {
      // Display name: Capacity Units
      capacityUnits: {
        type: "column",
        name: "capacity_units",
        sourceName: "inventory_warehouses_wide",
        jsType: "number",
        fieldId: 2742,
        tableId: 303,
        baseType: "type/Integer"
      },
      // Display name: City Name
      cityName: {
        type: "column",
        name: "city_name",
        sourceName: "inventory_warehouses_wide",
        jsType: "string",
        fieldId: 2739,
        tableId: 303,
        baseType: "type/Text"
      },
      // Display name: Country Name
      countryName: {
        type: "column",
        name: "country_name",
        sourceName: "inventory_warehouses_wide",
        jsType: "string",
        fieldId: 2740,
        tableId: 303,
        baseType: "type/Text"
      },
      // Display name: Is Active
      isActive: {
        type: "column",
        name: "is_active",
        sourceName: "inventory_warehouses_wide",
        jsType: "boolean",
        fieldId: 2743,
        tableId: 303,
        baseType: "type/Boolean"
      },
      // Display name: Region Name
      regionName: {
        type: "column",
        name: "region_name",
        sourceName: "inventory_warehouses_wide",
        jsType: "string",
        fieldId: 2741,
        tableId: 303,
        baseType: "type/Text"
      },
      // Display name: Warehouse ID
      warehouseId: {
        type: "column",
        name: "warehouse_id",
        sourceName: "inventory_warehouses_wide",
        jsType: "number",
        fieldId: 2737,
        tableId: 303,
        baseType: "type/BigInteger"
      },
      // Display name: Warehouse Name
      warehouseName: {
        type: "column",
        name: "warehouse_name",
        sourceName: "inventory_warehouses_wide",
        jsType: "string",
        fieldId: 2738,
        tableId: 303,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: legacy_users
  legacyUsers: {
    type: "table",
    id: 269,
    name: "Legacy Users",
    fields: {
      // Display name: Created At
      createdAt: {
        type: "column",
        name: "created_at",
        sourceName: "legacy_users",
        jsType: "Date",
        fieldId: 2267,
        tableId: 269,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Email
      email: {
        type: "column",
        name: "email",
        sourceName: "legacy_users",
        jsType: "string",
        fieldId: 2265,
        tableId: 269,
        baseType: "type/Text"
      },
      // Display name: Full Name
      fullName: {
        type: "column",
        name: "full_name",
        sourceName: "legacy_users",
        jsType: "string",
        fieldId: 2266,
        tableId: 269,
        baseType: "type/Text"
      },
      // Display name: Is Active
      isActive: {
        type: "column",
        name: "is_active",
        sourceName: "legacy_users",
        jsType: "boolean",
        fieldId: 2268,
        tableId: 269,
        baseType: "type/Boolean"
      },
      // Display name: User ID
      userId: {
        type: "column",
        name: "user_id",
        sourceName: "legacy_users",
        jsType: "number",
        fieldId: 2264,
        tableId: 269,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_ad_spend_daily
  marketingAdSpendDaily: {
    type: "table",
    id: 304,
    name: "Marketing Ad Spend Daily",
    fields: {
      // Display name: Ad Spend ID
      adSpendId: {
        type: "column",
        name: "ad_spend_id",
        sourceName: "marketing_ad_spend_daily",
        jsType: "number",
        fieldId: 2744,
        tableId: 304,
        baseType: "type/BigInteger"
      },
      // Display name: Campaign Name
      campaignName: {
        type: "column",
        name: "campaign_name",
        sourceName: "marketing_ad_spend_daily",
        jsType: "string",
        fieldId: 2746,
        tableId: 304,
        baseType: "type/Text"
      },
      // Display name: Clicks
      clicks: {
        type: "column",
        name: "clicks",
        sourceName: "marketing_ad_spend_daily",
        jsType: "number",
        fieldId: 2749,
        tableId: 304,
        baseType: "type/Integer"
      },
      // Display name: Impressions
      impressions: {
        type: "column",
        name: "impressions",
        sourceName: "marketing_ad_spend_daily",
        jsType: "number",
        fieldId: 2748,
        tableId: 304,
        baseType: "type/Integer"
      },
      // Display name: Platform Name
      platformName: {
        type: "column",
        name: "platform_name",
        sourceName: "marketing_ad_spend_daily",
        jsType: "string",
        fieldId: 2747,
        tableId: 304,
        baseType: "type/Text"
      },
      // Display name: Spend Amount
      spendAmount: {
        type: "column",
        name: "spend_amount",
        sourceName: "marketing_ad_spend_daily",
        jsType: "number",
        fieldId: 2750,
        tableId: 304,
        baseType: "type/Decimal"
      },
      // Display name: Spend Date
      spendDate: {
        type: "column",
        name: "spend_date",
        sourceName: "marketing_ad_spend_daily",
        jsType: "Date",
        fieldId: 2745,
        tableId: 304,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_campaigns_wide
  marketingCampaignsWide: {
    type: "table",
    id: 305,
    name: "Marketing Campaigns Wide",
    fields: {
      // Display name: Budget Amount
      budgetAmount: {
        type: "column",
        name: "budget_amount",
        sourceName: "marketing_campaigns_wide",
        jsType: "number",
        fieldId: 2758,
        tableId: 305,
        baseType: "type/Decimal"
      },
      // Display name: Campaign ID
      campaignId: {
        type: "column",
        name: "campaign_id",
        sourceName: "marketing_campaigns_wide",
        jsType: "number",
        fieldId: 2751,
        tableId: 305,
        baseType: "type/BigInteger"
      },
      // Display name: Campaign Name
      campaignName: {
        type: "column",
        name: "campaign_name",
        sourceName: "marketing_campaigns_wide",
        jsType: "string",
        fieldId: 2752,
        tableId: 305,
        baseType: "type/Text"
      },
      // Display name: Channel Name
      channelName: {
        type: "column",
        name: "channel_name",
        sourceName: "marketing_campaigns_wide",
        jsType: "string",
        fieldId: 2753,
        tableId: 305,
        baseType: "type/Text"
      },
      // Display name: End Date
      endDate: {
        type: "column",
        name: "end_date",
        sourceName: "marketing_campaigns_wide",
        jsType: "Date",
        fieldId: 2757,
        tableId: 305,
        baseType: "type/Date"
      },
      // Display name: Objective Name
      objectiveName: {
        type: "column",
        name: "objective_name",
        sourceName: "marketing_campaigns_wide",
        jsType: "string",
        fieldId: 2754,
        tableId: 305,
        baseType: "type/Text"
      },
      // Display name: Owner Name
      ownerName: {
        type: "column",
        name: "owner_name",
        sourceName: "marketing_campaigns_wide",
        jsType: "string",
        fieldId: 2755,
        tableId: 305,
        baseType: "type/Text"
      },
      // Display name: Start Date
      startDate: {
        type: "column",
        name: "start_date",
        sourceName: "marketing_campaigns_wide",
        jsType: "Date",
        fieldId: 2756,
        tableId: 305,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_email_events
  marketingEmailEvents: {
    type: "table",
    id: 306,
    name: "Marketing Email Events",
    fields: {
      // Display name: Event At
      eventAt: {
        type: "column",
        name: "event_at",
        sourceName: "marketing_email_events",
        jsType: "Date",
        fieldId: 2763,
        tableId: 306,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Event ID
      eventId: {
        type: "column",
        name: "event_id",
        sourceName: "marketing_email_events",
        jsType: "number",
        fieldId: 2759,
        tableId: 306,
        baseType: "type/BigInteger"
      },
      // Display name: Event Type
      eventType: {
        type: "column",
        name: "event_type",
        sourceName: "marketing_email_events",
        jsType: "string",
        fieldId: 2762,
        tableId: 306,
        baseType: "type/Text"
      },
      // Display name: Link URL
      linkUrl: {
        type: "column",
        name: "link_url",
        sourceName: "marketing_email_events",
        jsType: "string",
        fieldId: 2764,
        tableId: 306,
        baseType: "type/Text"
      },
      // Display name: Recipient Email
      recipientEmail: {
        type: "column",
        name: "recipient_email",
        sourceName: "marketing_email_events",
        jsType: "string",
        fieldId: 2761,
        tableId: 306,
        baseType: "type/Text"
      },
      // Display name: Send ID
      sendId: {
        type: "column",
        name: "send_id",
        sourceName: "marketing_email_events",
        jsType: "number",
        fieldId: 2760,
        tableId: 306,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_email_sends
  marketingEmailSends: {
    type: "table",
    id: 307,
    name: "Marketing Email Sends",
    fields: {
      // Display name: Campaign Name
      campaignName: {
        type: "column",
        name: "campaign_name",
        sourceName: "marketing_email_sends",
        jsType: "string",
        fieldId: 2766,
        tableId: 307,
        baseType: "type/Text"
      },
      // Display name: Is Test
      isTest: {
        type: "column",
        name: "is_test",
        sourceName: "marketing_email_sends",
        jsType: "boolean",
        fieldId: 2770,
        tableId: 307,
        baseType: "type/Boolean"
      },
      // Display name: Recipient Email
      recipientEmail: {
        type: "column",
        name: "recipient_email",
        sourceName: "marketing_email_sends",
        jsType: "string",
        fieldId: 2767,
        tableId: 307,
        baseType: "type/Text"
      },
      // Display name: Send ID
      sendId: {
        type: "column",
        name: "send_id",
        sourceName: "marketing_email_sends",
        jsType: "number",
        fieldId: 2765,
        tableId: 307,
        baseType: "type/BigInteger"
      },
      // Display name: Sent At
      sentAt: {
        type: "column",
        name: "sent_at",
        sourceName: "marketing_email_sends",
        jsType: "Date",
        fieldId: 2769,
        tableId: 307,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Subject Line
      subjectLine: {
        type: "column",
        name: "subject_line",
        sourceName: "marketing_email_sends",
        jsType: "string",
        fieldId: 2768,
        tableId: 307,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_lead_conversions
  marketingLeadConversions: {
    type: "table",
    id: 308,
    name: "Marketing Lead Conversions",
    fields: {
      // Display name: Conversion ID
      conversionId: {
        type: "column",
        name: "conversion_id",
        sourceName: "marketing_lead_conversions",
        jsType: "number",
        fieldId: 2771,
        tableId: 308,
        baseType: "type/BigInteger"
      },
      // Display name: Converted Date
      convertedDate: {
        type: "column",
        name: "converted_date",
        sourceName: "marketing_lead_conversions",
        jsType: "Date",
        fieldId: 2773,
        tableId: 308,
        baseType: "type/Date"
      },
      // Display name: Deal Amount
      dealAmount: {
        type: "column",
        name: "deal_amount",
        sourceName: "marketing_lead_conversions",
        jsType: "number",
        fieldId: 2777,
        tableId: 308,
        baseType: "type/Decimal"
      },
      // Display name: First Touch Channel
      firstTouchChannel: {
        type: "column",
        name: "first_touch_channel",
        sourceName: "marketing_lead_conversions",
        jsType: "string",
        fieldId: 2775,
        tableId: 308,
        baseType: "type/Text"
      },
      // Display name: Last Touch Channel
      lastTouchChannel: {
        type: "column",
        name: "last_touch_channel",
        sourceName: "marketing_lead_conversions",
        jsType: "string",
        fieldId: 2776,
        tableId: 308,
        baseType: "type/Text"
      },
      // Display name: Lead ID
      leadId: {
        type: "column",
        name: "lead_id",
        sourceName: "marketing_lead_conversions",
        jsType: "number",
        fieldId: 2772,
        tableId: 308,
        baseType: "type/BigInteger"
      },
      // Display name: Opportunity Name
      opportunityName: {
        type: "column",
        name: "opportunity_name",
        sourceName: "marketing_lead_conversions",
        jsType: "string",
        fieldId: 2774,
        tableId: 308,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_leads_wide
  marketingLeadsWide: {
    type: "table",
    id: 309,
    name: "Marketing Leads Wide",
    fields: {
      // Display name: Campaign Name
      campaignName: {
        type: "column",
        name: "campaign_name",
        sourceName: "marketing_leads_wide",
        jsType: "string",
        fieldId: 2784,
        tableId: 309,
        baseType: "type/Text"
      },
      // Display name: Company Name
      companyName: {
        type: "column",
        name: "company_name",
        sourceName: "marketing_leads_wide",
        jsType: "string",
        fieldId: 2782,
        tableId: 309,
        baseType: "type/Text"
      },
      // Display name: Created Date
      createdDate: {
        type: "column",
        name: "created_date",
        sourceName: "marketing_leads_wide",
        jsType: "Date",
        fieldId: 2779,
        tableId: 309,
        baseType: "type/Date"
      },
      // Display name: Email
      email: {
        type: "column",
        name: "email",
        sourceName: "marketing_leads_wide",
        jsType: "string",
        fieldId: 2781,
        tableId: 309,
        baseType: "type/Text"
      },
      // Display name: Full Name
      fullName: {
        type: "column",
        name: "full_name",
        sourceName: "marketing_leads_wide",
        jsType: "string",
        fieldId: 2780,
        tableId: 309,
        baseType: "type/Text"
      },
      // Display name: Lead ID
      leadId: {
        type: "column",
        name: "lead_id",
        sourceName: "marketing_leads_wide",
        jsType: "number",
        fieldId: 2778,
        tableId: 309,
        baseType: "type/BigInteger"
      },
      // Display name: Lead Score
      leadScore: {
        type: "column",
        name: "lead_score",
        sourceName: "marketing_leads_wide",
        jsType: "number",
        fieldId: 2786,
        tableId: 309,
        baseType: "type/Decimal"
      },
      // Display name: Lead Source
      leadSource: {
        type: "column",
        name: "lead_source",
        sourceName: "marketing_leads_wide",
        jsType: "string",
        fieldId: 2783,
        tableId: 309,
        baseType: "type/Text"
      },
      // Display name: Lead Status
      leadStatus: {
        type: "column",
        name: "lead_status",
        sourceName: "marketing_leads_wide",
        jsType: "string",
        fieldId: 2785,
        tableId: 309,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_page_views
  marketingPageViews: {
    type: "table",
    id: 310,
    name: "Marketing Page Views",
    fields: {
      // Display name: Page URL
      pageUrl: {
        type: "column",
        name: "page_url",
        sourceName: "marketing_page_views",
        jsType: "string",
        fieldId: 2790,
        tableId: 310,
        baseType: "type/Text"
      },
      // Display name: Page View ID
      pageViewId: {
        type: "column",
        name: "page_view_id",
        sourceName: "marketing_page_views",
        jsType: "number",
        fieldId: 2787,
        tableId: 310,
        baseType: "type/BigInteger"
      },
      // Display name: Session ID
      sessionId: {
        type: "column",
        name: "session_id",
        sourceName: "marketing_page_views",
        jsType: "number",
        fieldId: 2788,
        tableId: 310,
        baseType: "type/BigInteger"
      },
      // Display name: Time On Page Seconds
      timeOnPageSeconds: {
        type: "column",
        name: "time_on_page_seconds",
        sourceName: "marketing_page_views",
        jsType: "number",
        fieldId: 2791,
        tableId: 310,
        baseType: "type/Integer"
      },
      // Display name: Viewed At
      viewedAt: {
        type: "column",
        name: "viewed_at",
        sourceName: "marketing_page_views",
        jsType: "Date",
        fieldId: 2789,
        tableId: 310,
        baseType: "type/DateTimeWithLocalTZ"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_social_posts
  marketingSocialPosts: {
    type: "table",
    id: 311,
    name: "Marketing Social Posts",
    fields: {
      // Display name: Campaign Name
      campaignName: {
        type: "column",
        name: "campaign_name",
        sourceName: "marketing_social_posts",
        jsType: "string",
        fieldId: 2795,
        tableId: 311,
        baseType: "type/Text"
      },
      // Display name: Comments Count
      commentsCount: {
        type: "column",
        name: "comments_count",
        sourceName: "marketing_social_posts",
        jsType: "number",
        fieldId: 2798,
        tableId: 311,
        baseType: "type/Integer"
      },
      // Display name: Likes Count
      likesCount: {
        type: "column",
        name: "likes_count",
        sourceName: "marketing_social_posts",
        jsType: "number",
        fieldId: 2796,
        tableId: 311,
        baseType: "type/Integer"
      },
      // Display name: Platform Name
      platformName: {
        type: "column",
        name: "platform_name",
        sourceName: "marketing_social_posts",
        jsType: "string",
        fieldId: 2794,
        tableId: 311,
        baseType: "type/Text"
      },
      // Display name: Post ID
      postId: {
        type: "column",
        name: "post_id",
        sourceName: "marketing_social_posts",
        jsType: "number",
        fieldId: 2792,
        tableId: 311,
        baseType: "type/BigInteger"
      },
      // Display name: Posted At
      postedAt: {
        type: "column",
        name: "posted_at",
        sourceName: "marketing_social_posts",
        jsType: "Date",
        fieldId: 2793,
        tableId: 311,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Shares Count
      sharesCount: {
        type: "column",
        name: "shares_count",
        sourceName: "marketing_social_posts",
        jsType: "number",
        fieldId: 2797,
        tableId: 311,
        baseType: "type/Integer"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_survey_responses
  marketingSurveyResponses: {
    type: "table",
    id: 312,
    name: "Marketing Survey Responses",
    fields: {
      // Display name: Comment Text
      commentText: {
        type: "column",
        name: "comment_text",
        sourceName: "marketing_survey_responses",
        jsType: "string",
        fieldId: 2804,
        tableId: 312,
        baseType: "type/Text"
      },
      // Display name: Respondent Email
      respondentEmail: {
        type: "column",
        name: "respondent_email",
        sourceName: "marketing_survey_responses",
        jsType: "string",
        fieldId: 2801,
        tableId: 312,
        baseType: "type/Text"
      },
      // Display name: Response ID
      responseId: {
        type: "column",
        name: "response_id",
        sourceName: "marketing_survey_responses",
        jsType: "number",
        fieldId: 2799,
        tableId: 312,
        baseType: "type/BigInteger"
      },
      // Display name: Satisfaction Score
      satisfactionScore: {
        type: "column",
        name: "satisfaction_score",
        sourceName: "marketing_survey_responses",
        jsType: "number",
        fieldId: 2803,
        tableId: 312,
        baseType: "type/Decimal"
      },
      // Display name: Submitted At
      submittedAt: {
        type: "column",
        name: "submitted_at",
        sourceName: "marketing_survey_responses",
        jsType: "Date",
        fieldId: 2802,
        tableId: 312,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Survey Name
      surveyName: {
        type: "column",
        name: "survey_name",
        sourceName: "marketing_survey_responses",
        jsType: "string",
        fieldId: 2800,
        tableId: 312,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: marketing_web_sessions
  marketingWebSessions: {
    type: "table",
    id: 313,
    name: "Marketing Web Sessions",
    fields: {
      // Display name: Country Name
      countryName: {
        type: "column",
        name: "country_name",
        sourceName: "marketing_web_sessions",
        jsType: "string",
        fieldId: 2811,
        tableId: 313,
        baseType: "type/Text"
      },
      // Display name: Device Type
      deviceType: {
        type: "column",
        name: "device_type",
        sourceName: "marketing_web_sessions",
        jsType: "string",
        fieldId: 2810,
        tableId: 313,
        baseType: "type/Text"
      },
      // Display name: Landing Page
      landingPage: {
        type: "column",
        name: "landing_page",
        sourceName: "marketing_web_sessions",
        jsType: "string",
        fieldId: 2808,
        tableId: 313,
        baseType: "type/Text"
      },
      // Display name: Page Count
      pageCount: {
        type: "column",
        name: "page_count",
        sourceName: "marketing_web_sessions",
        jsType: "number",
        fieldId: 2812,
        tableId: 313,
        baseType: "type/Integer"
      },
      // Display name: Referrer Name
      referrerName: {
        type: "column",
        name: "referrer_name",
        sourceName: "marketing_web_sessions",
        jsType: "string",
        fieldId: 2809,
        tableId: 313,
        baseType: "type/Text"
      },
      // Display name: Session ID
      sessionId: {
        type: "column",
        name: "session_id",
        sourceName: "marketing_web_sessions",
        jsType: "number",
        fieldId: 2805,
        tableId: 313,
        baseType: "type/BigInteger"
      },
      // Display name: Session Start At
      sessionStartAt: {
        type: "column",
        name: "session_start_at",
        sourceName: "marketing_web_sessions",
        jsType: "Date",
        fieldId: 2807,
        tableId: 313,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Visitor ID
      visitorId: {
        type: "column",
        name: "visitor_id",
        sourceName: "marketing_web_sessions",
        jsType: "number",
        fieldId: 2806,
        tableId: 313,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  notifications: {
    type: "table",
    id: 270,
    name: "Notifications",
    fields: {
      // Display name: Channel
      channel: {
        type: "column",
        name: "channel",
        sourceName: "notifications",
        jsType: "string",
        fieldId: 2271,
        tableId: 270,
        baseType: "type/Text"
      },
      // Display name: Is Read
      isRead: {
        type: "column",
        name: "is_read",
        sourceName: "notifications",
        jsType: "boolean",
        fieldId: 2274,
        tableId: 270,
        baseType: "type/Boolean"
      },
      // Display name: Notification ID
      notificationId: {
        type: "column",
        name: "notification_id",
        sourceName: "notifications",
        jsType: "number",
        fieldId: 2269,
        tableId: 270,
        baseType: "type/BigInteger"
      },
      // Display name: Recipient Email
      recipientEmail: {
        type: "column",
        name: "recipient_email",
        sourceName: "notifications",
        jsType: "string",
        fieldId: 2270,
        tableId: 270,
        baseType: "type/Text"
      },
      // Display name: Sent At
      sentAt: {
        type: "column",
        name: "sent_at",
        sourceName: "notifications",
        jsType: "Date",
        fieldId: 2273,
        tableId: 270,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Subject
      subject: {
        type: "column",
        name: "subject",
        sourceName: "notifications",
        jsType: "string",
        fieldId: 2272,
        tableId: 270,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_bank_transfers
  payrollBankTransfers: {
    type: "table",
    id: 314,
    name: "Payroll Bank Transfers",
    fields: {
      // Display name: Bank Name
      bankName: {
        type: "column",
        name: "bank_name",
        sourceName: "payroll_bank_transfers",
        jsType: "string",
        fieldId: 2816,
        tableId: 314,
        baseType: "type/Text"
      },
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "payroll_bank_transfers",
        jsType: "number",
        fieldId: 2815,
        tableId: 314,
        baseType: "type/BigInteger"
      },
      // Display name: Payroll Run ID
      payrollRunId: {
        type: "column",
        name: "payroll_run_id",
        sourceName: "payroll_bank_transfers",
        jsType: "number",
        fieldId: 2814,
        tableId: 314,
        baseType: "type/BigInteger"
      },
      // Display name: Transfer Amount
      transferAmount: {
        type: "column",
        name: "transfer_amount",
        sourceName: "payroll_bank_transfers",
        jsType: "number",
        fieldId: 2818,
        tableId: 314,
        baseType: "type/Decimal"
      },
      // Display name: Transfer Date
      transferDate: {
        type: "column",
        name: "transfer_date",
        sourceName: "payroll_bank_transfers",
        jsType: "Date",
        fieldId: 2817,
        tableId: 314,
        baseType: "type/Date"
      },
      // Display name: Transfer ID
      transferId: {
        type: "column",
        name: "transfer_id",
        sourceName: "payroll_bank_transfers",
        jsType: "number",
        fieldId: 2813,
        tableId: 314,
        baseType: "type/BigInteger"
      },
      // Display name: Transfer Status
      transferStatus: {
        type: "column",
        name: "transfer_status",
        sourceName: "payroll_bank_transfers",
        jsType: "string",
        fieldId: 2819,
        tableId: 314,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_benefits_enrollments
  payrollBenefitsEnrollments: {
    type: "table",
    id: 315,
    name: "Payroll Benefits Enrollments",
    fields: {
      // Display name: Coverage Level
      coverageLevel: {
        type: "column",
        name: "coverage_level",
        sourceName: "payroll_benefits_enrollments",
        jsType: "string",
        fieldId: 2823,
        tableId: 315,
        baseType: "type/Text"
      },
      // Display name: Effective Date
      effectiveDate: {
        type: "column",
        name: "effective_date",
        sourceName: "payroll_benefits_enrollments",
        jsType: "Date",
        fieldId: 2824,
        tableId: 315,
        baseType: "type/Date"
      },
      // Display name: Employee Cost
      employeeCost: {
        type: "column",
        name: "employee_cost",
        sourceName: "payroll_benefits_enrollments",
        jsType: "number",
        fieldId: 2825,
        tableId: 315,
        baseType: "type/Decimal"
      },
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "payroll_benefits_enrollments",
        jsType: "number",
        fieldId: 2821,
        tableId: 315,
        baseType: "type/BigInteger"
      },
      // Display name: Employer Cost
      employerCost: {
        type: "column",
        name: "employer_cost",
        sourceName: "payroll_benefits_enrollments",
        jsType: "number",
        fieldId: 2826,
        tableId: 315,
        baseType: "type/Decimal"
      },
      // Display name: Enrollment ID
      enrollmentId: {
        type: "column",
        name: "enrollment_id",
        sourceName: "payroll_benefits_enrollments",
        jsType: "number",
        fieldId: 2820,
        tableId: 315,
        baseType: "type/BigInteger"
      },
      // Display name: Plan Name
      planName: {
        type: "column",
        name: "plan_name",
        sourceName: "payroll_benefits_enrollments",
        jsType: "string",
        fieldId: 2822,
        tableId: 315,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_bonus_payments
  payrollBonusPayments: {
    type: "table",
    id: 316,
    name: "Payroll Bonus Payments",
    fields: {
      // Display name: Approver Name
      approverName: {
        type: "column",
        name: "approver_name",
        sourceName: "payroll_bonus_payments",
        jsType: "string",
        fieldId: 2832,
        tableId: 316,
        baseType: "type/Text"
      },
      // Display name: Award Date
      awardDate: {
        type: "column",
        name: "award_date",
        sourceName: "payroll_bonus_payments",
        jsType: "Date",
        fieldId: 2830,
        tableId: 316,
        baseType: "type/Date"
      },
      // Display name: Bonus Amount
      bonusAmount: {
        type: "column",
        name: "bonus_amount",
        sourceName: "payroll_bonus_payments",
        jsType: "number",
        fieldId: 2831,
        tableId: 316,
        baseType: "type/Decimal"
      },
      // Display name: Bonus ID
      bonusId: {
        type: "column",
        name: "bonus_id",
        sourceName: "payroll_bonus_payments",
        jsType: "number",
        fieldId: 2827,
        tableId: 316,
        baseType: "type/BigInteger"
      },
      // Display name: Bonus Type
      bonusType: {
        type: "column",
        name: "bonus_type",
        sourceName: "payroll_bonus_payments",
        jsType: "string",
        fieldId: 2829,
        tableId: 316,
        baseType: "type/Text"
      },
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "payroll_bonus_payments",
        jsType: "number",
        fieldId: 2828,
        tableId: 316,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_deductions
  payrollDeductions: {
    type: "table",
    id: 317,
    name: "Payroll Deductions",
    fields: {
      // Display name: Deduction Amount
      deductionAmount: {
        type: "column",
        name: "deduction_amount",
        sourceName: "payroll_deductions",
        jsType: "number",
        fieldId: 2837,
        tableId: 317,
        baseType: "type/Decimal"
      },
      // Display name: Deduction ID
      deductionId: {
        type: "column",
        name: "deduction_id",
        sourceName: "payroll_deductions",
        jsType: "number",
        fieldId: 2833,
        tableId: 317,
        baseType: "type/BigInteger"
      },
      // Display name: Deduction Type
      deductionType: {
        type: "column",
        name: "deduction_type",
        sourceName: "payroll_deductions",
        jsType: "string",
        fieldId: 2836,
        tableId: 317,
        baseType: "type/Text"
      },
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "payroll_deductions",
        jsType: "number",
        fieldId: 2835,
        tableId: 317,
        baseType: "type/BigInteger"
      },
      // Display name: Payroll Run ID
      payrollRunId: {
        type: "column",
        name: "payroll_run_id",
        sourceName: "payroll_deductions",
        jsType: "number",
        fieldId: 2834,
        tableId: 317,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_employee_earnings
  payrollEmployeeEarnings: {
    type: "table",
    id: 318,
    name: "Payroll Employee Earnings",
    fields: {
      // Display name: Base Salary
      baseSalary: {
        type: "column",
        name: "base_salary",
        sourceName: "payroll_employee_earnings",
        jsType: "number",
        fieldId: 2842,
        tableId: 318,
        baseType: "type/Decimal"
      },
      // Display name: Bonus Amount
      bonusAmount: {
        type: "column",
        name: "bonus_amount",
        sourceName: "payroll_employee_earnings",
        jsType: "number",
        fieldId: 2844,
        tableId: 318,
        baseType: "type/Decimal"
      },
      // Display name: Earning ID
      earningId: {
        type: "column",
        name: "earning_id",
        sourceName: "payroll_employee_earnings",
        jsType: "number",
        fieldId: 2838,
        tableId: 318,
        baseType: "type/BigInteger"
      },
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "payroll_employee_earnings",
        jsType: "number",
        fieldId: 2840,
        tableId: 318,
        baseType: "type/BigInteger"
      },
      // Display name: Employee Name
      employeeName: {
        type: "column",
        name: "employee_name",
        sourceName: "payroll_employee_earnings",
        jsType: "string",
        fieldId: 2841,
        tableId: 318,
        baseType: "type/Text"
      },
      // Display name: Gross Total
      grossTotal: {
        type: "column",
        name: "gross_total",
        sourceName: "payroll_employee_earnings",
        jsType: "number",
        fieldId: 2845,
        tableId: 318,
        baseType: "type/Decimal"
      },
      // Display name: Overtime Amount
      overtimeAmount: {
        type: "column",
        name: "overtime_amount",
        sourceName: "payroll_employee_earnings",
        jsType: "number",
        fieldId: 2843,
        tableId: 318,
        baseType: "type/Decimal"
      },
      // Display name: Payroll Run ID
      payrollRunId: {
        type: "column",
        name: "payroll_run_id",
        sourceName: "payroll_employee_earnings",
        jsType: "number",
        fieldId: 2839,
        tableId: 318,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_runs
  payrollRuns: {
    type: "table",
    id: 319,
    name: "Payroll Runs",
    fields: {
      // Display name: Pay Date
      payDate: {
        type: "column",
        name: "pay_date",
        sourceName: "payroll_runs",
        jsType: "Date",
        fieldId: 2849,
        tableId: 319,
        baseType: "type/Date"
      },
      // Display name: Pay Period End Date
      payPeriodEndDate: {
        type: "column",
        name: "pay_period_end_date",
        sourceName: "payroll_runs",
        jsType: "Date",
        fieldId: 2848,
        tableId: 319,
        baseType: "type/Date"
      },
      // Display name: Pay Period Start Date
      payPeriodStartDate: {
        type: "column",
        name: "pay_period_start_date",
        sourceName: "payroll_runs",
        jsType: "Date",
        fieldId: 2847,
        tableId: 319,
        baseType: "type/Date"
      },
      // Display name: Payroll Run ID
      payrollRunId: {
        type: "column",
        name: "payroll_run_id",
        sourceName: "payroll_runs",
        jsType: "number",
        fieldId: 2846,
        tableId: 319,
        baseType: "type/BigInteger"
      },
      // Display name: Run Status
      runStatus: {
        type: "column",
        name: "run_status",
        sourceName: "payroll_runs",
        jsType: "string",
        fieldId: 2850,
        tableId: 319,
        baseType: "type/Text"
      },
      // Display name: Total Gross Amount
      totalGrossAmount: {
        type: "column",
        name: "total_gross_amount",
        sourceName: "payroll_runs",
        jsType: "number",
        fieldId: 2851,
        tableId: 319,
        baseType: "type/Decimal"
      },
      // Display name: Total Net Amount
      totalNetAmount: {
        type: "column",
        name: "total_net_amount",
        sourceName: "payroll_runs",
        jsType: "number",
        fieldId: 2852,
        tableId: 319,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_taxes_withheld
  payrollTaxesWithheld: {
    type: "table",
    id: 320,
    name: "Payroll Taxes Withheld",
    fields: {
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "payroll_taxes_withheld",
        jsType: "number",
        fieldId: 2855,
        tableId: 320,
        baseType: "type/BigInteger"
      },
      // Display name: Jurisdiction Name
      jurisdictionName: {
        type: "column",
        name: "jurisdiction_name",
        sourceName: "payroll_taxes_withheld",
        jsType: "string",
        fieldId: 2856,
        tableId: 320,
        baseType: "type/Text"
      },
      // Display name: Payroll Run ID
      payrollRunId: {
        type: "column",
        name: "payroll_run_id",
        sourceName: "payroll_taxes_withheld",
        jsType: "number",
        fieldId: 2854,
        tableId: 320,
        baseType: "type/BigInteger"
      },
      // Display name: Tax Amount
      taxAmount: {
        type: "column",
        name: "tax_amount",
        sourceName: "payroll_taxes_withheld",
        jsType: "number",
        fieldId: 2858,
        tableId: 320,
        baseType: "type/Decimal"
      },
      // Display name: Tax ID
      taxId: {
        type: "column",
        name: "tax_id",
        sourceName: "payroll_taxes_withheld",
        jsType: "number",
        fieldId: 2853,
        tableId: 320,
        baseType: "type/BigInteger"
      },
      // Display name: Tax Type
      taxType: {
        type: "column",
        name: "tax_type",
        sourceName: "payroll_taxes_withheld",
        jsType: "string",
        fieldId: 2857,
        tableId: 320,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: payroll_timesheets_wide
  payrollTimesheetsWide: {
    type: "table",
    id: 321,
    name: "Payroll Timesheets Wide",
    fields: {
      // Display name: Approved Date
      approvedDate: {
        type: "column",
        name: "approved_date",
        sourceName: "payroll_timesheets_wide",
        jsType: "Date",
        fieldId: 2865,
        tableId: 321,
        baseType: "type/Date"
      },
      // Display name: Employee ID
      employeeId: {
        type: "column",
        name: "employee_id",
        sourceName: "payroll_timesheets_wide",
        jsType: "number",
        fieldId: 2860,
        tableId: 321,
        baseType: "type/BigInteger"
      },
      // Display name: Overtime Hours
      overtimeHours: {
        type: "column",
        name: "overtime_hours",
        sourceName: "payroll_timesheets_wide",
        jsType: "number",
        fieldId: 2864,
        tableId: 321,
        baseType: "type/Decimal"
      },
      // Display name: Project Name
      projectName: {
        type: "column",
        name: "project_name",
        sourceName: "payroll_timesheets_wide",
        jsType: "string",
        fieldId: 2862,
        tableId: 321,
        baseType: "type/Text"
      },
      // Display name: Regular Hours
      regularHours: {
        type: "column",
        name: "regular_hours",
        sourceName: "payroll_timesheets_wide",
        jsType: "number",
        fieldId: 2863,
        tableId: 321,
        baseType: "type/Decimal"
      },
      // Display name: Timesheet ID
      timesheetId: {
        type: "column",
        name: "timesheet_id",
        sourceName: "payroll_timesheets_wide",
        jsType: "number",
        fieldId: 2859,
        tableId: 321,
        baseType: "type/BigInteger"
      },
      // Display name: Work Date
      workDate: {
        type: "column",
        name: "work_date",
        sourceName: "payroll_timesheets_wide",
        jsType: "Date",
        fieldId: 2861,
        tableId: 321,
        baseType: "type/Date"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_customers_wide
  salesCustomersWide: {
    type: "table",
    id: 322,
    name: "Sales Customers Wide",
    fields: {
      // Display name: Account Owner Name
      accountOwnerName: {
        type: "column",
        name: "account_owner_name",
        sourceName: "sales_customers_wide",
        jsType: "string",
        fieldId: 2872,
        tableId: 322,
        baseType: "type/Text"
      },
      // Display name: Country Name
      countryName: {
        type: "column",
        name: "country_name",
        sourceName: "sales_customers_wide",
        jsType: "string",
        fieldId: 2871,
        tableId: 322,
        baseType: "type/Text"
      },
      // Display name: Customer ID
      customerId: {
        type: "column",
        name: "customer_id",
        sourceName: "sales_customers_wide",
        jsType: "number",
        fieldId: 2866,
        tableId: 322,
        baseType: "type/BigInteger"
      },
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "sales_customers_wide",
        jsType: "string",
        fieldId: 2867,
        tableId: 322,
        baseType: "type/Text"
      },
      // Display name: First Order Date
      firstOrderDate: {
        type: "column",
        name: "first_order_date",
        sourceName: "sales_customers_wide",
        jsType: "Date",
        fieldId: 2873,
        tableId: 322,
        baseType: "type/Date"
      },
      // Display name: Industry Name
      industryName: {
        type: "column",
        name: "industry_name",
        sourceName: "sales_customers_wide",
        jsType: "string",
        fieldId: 2869,
        tableId: 322,
        baseType: "type/Text"
      },
      // Display name: Lifetime Value
      lifetimeValue: {
        type: "column",
        name: "lifetime_value",
        sourceName: "sales_customers_wide",
        jsType: "number",
        fieldId: 2874,
        tableId: 322,
        baseType: "type/Decimal"
      },
      // Display name: Region Name
      regionName: {
        type: "column",
        name: "region_name",
        sourceName: "sales_customers_wide",
        jsType: "string",
        fieldId: 2870,
        tableId: 322,
        baseType: "type/Text"
      },
      // Display name: Segment Name
      segmentName: {
        type: "column",
        name: "segment_name",
        sourceName: "sales_customers_wide",
        jsType: "string",
        fieldId: 2868,
        tableId: 322,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_invoices_wide
  salesInvoicesWide: {
    type: "table",
    id: 323,
    name: "Sales Invoices Wide",
    fields: {
      // Display name: Balance Amount
      balanceAmount: {
        type: "column",
        name: "balance_amount",
        sourceName: "sales_invoices_wide",
        jsType: "number",
        fieldId: 2883,
        tableId: 323,
        baseType: "type/Decimal"
      },
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "sales_invoices_wide",
        jsType: "string",
        fieldId: 2879,
        tableId: 323,
        baseType: "type/Text"
      },
      // Display name: Due Date
      dueDate: {
        type: "column",
        name: "due_date",
        sourceName: "sales_invoices_wide",
        jsType: "Date",
        fieldId: 2878,
        tableId: 323,
        baseType: "type/Date"
      },
      // Display name: Invoice Date
      invoiceDate: {
        type: "column",
        name: "invoice_date",
        sourceName: "sales_invoices_wide",
        jsType: "Date",
        fieldId: 2877,
        tableId: 323,
        baseType: "type/Date"
      },
      // Display name: Invoice ID
      invoiceId: {
        type: "column",
        name: "invoice_id",
        sourceName: "sales_invoices_wide",
        jsType: "number",
        fieldId: 2875,
        tableId: 323,
        baseType: "type/BigInteger"
      },
      // Display name: Invoice Number
      invoiceNumber: {
        type: "column",
        name: "invoice_number",
        sourceName: "sales_invoices_wide",
        jsType: "string",
        fieldId: 2876,
        tableId: 323,
        baseType: "type/Text"
      },
      // Display name: Invoice Status
      invoiceStatus: {
        type: "column",
        name: "invoice_status",
        sourceName: "sales_invoices_wide",
        jsType: "string",
        fieldId: 2881,
        tableId: 323,
        baseType: "type/Text"
      },
      // Display name: Payment Terms
      paymentTerms: {
        type: "column",
        name: "payment_terms",
        sourceName: "sales_invoices_wide",
        jsType: "string",
        fieldId: 2880,
        tableId: 323,
        baseType: "type/Text"
      },
      // Display name: Total Amount
      totalAmount: {
        type: "column",
        name: "total_amount",
        sourceName: "sales_invoices_wide",
        jsType: "number",
        fieldId: 2882,
        tableId: 323,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_opportunities_wide
  salesOpportunitiesWide: {
    type: "table",
    id: 324,
    name: "Sales Opportunities Wide",
    fields: {
      // Display name: Account Name
      accountName: {
        type: "column",
        name: "account_name",
        sourceName: "sales_opportunities_wide",
        jsType: "string",
        fieldId: 2886,
        tableId: 324,
        baseType: "type/Text"
      },
      // Display name: Expected Amount
      expectedAmount: {
        type: "column",
        name: "expected_amount",
        sourceName: "sales_opportunities_wide",
        jsType: "number",
        fieldId: 2891,
        tableId: 324,
        baseType: "type/Decimal"
      },
      // Display name: Expected Close Date
      expectedCloseDate: {
        type: "column",
        name: "expected_close_date",
        sourceName: "sales_opportunities_wide",
        jsType: "Date",
        fieldId: 2889,
        tableId: 324,
        baseType: "type/Date"
      },
      // Display name: Opportunity ID
      opportunityId: {
        type: "column",
        name: "opportunity_id",
        sourceName: "sales_opportunities_wide",
        jsType: "number",
        fieldId: 2884,
        tableId: 324,
        baseType: "type/BigInteger"
      },
      // Display name: Opportunity Name
      opportunityName: {
        type: "column",
        name: "opportunity_name",
        sourceName: "sales_opportunities_wide",
        jsType: "string",
        fieldId: 2885,
        tableId: 324,
        baseType: "type/Text"
      },
      // Display name: Owner Name
      ownerName: {
        type: "column",
        name: "owner_name",
        sourceName: "sales_opportunities_wide",
        jsType: "string",
        fieldId: 2887,
        tableId: 324,
        baseType: "type/Text"
      },
      // Display name: Probability Pct
      probabilityPct: {
        type: "column",
        name: "probability_pct",
        sourceName: "sales_opportunities_wide",
        jsType: "number",
        fieldId: 2890,
        tableId: 324,
        baseType: "type/Decimal"
      },
      // Display name: Stage Name
      stageName: {
        type: "column",
        name: "stage_name",
        sourceName: "sales_opportunities_wide",
        jsType: "string",
        fieldId: 2888,
        tableId: 324,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_order_lines_wide
  salesOrderLinesWide: {
    type: "table",
    id: 325,
    name: "Sales Order Lines Wide",
    fields: {
      // Display name: Brand Name
      brandName: {
        type: "column",
        name: "brand_name",
        sourceName: "sales_order_lines_wide",
        jsType: "string",
        fieldId: 2898,
        tableId: 325,
        baseType: "type/Text"
      },
      // Display name: Category Name
      categoryName: {
        type: "column",
        name: "category_name",
        sourceName: "sales_order_lines_wide",
        jsType: "string",
        fieldId: 2897,
        tableId: 325,
        baseType: "type/Text"
      },
      // Display name: Discount Amount
      discountAmount: {
        type: "column",
        name: "discount_amount",
        sourceName: "sales_order_lines_wide",
        jsType: "number",
        fieldId: 2901,
        tableId: 325,
        baseType: "type/Decimal"
      },
      // Display name: Line Total
      lineTotal: {
        type: "column",
        name: "line_total",
        sourceName: "sales_order_lines_wide",
        jsType: "number",
        fieldId: 2902,
        tableId: 325,
        baseType: "type/Decimal"
      },
      // Display name: Order Date
      orderDate: {
        type: "column",
        name: "order_date",
        sourceName: "sales_order_lines_wide",
        jsType: "Date",
        fieldId: 2894,
        tableId: 325,
        baseType: "type/Date"
      },
      // Display name: Order ID
      orderId: {
        type: "column",
        name: "order_id",
        sourceName: "sales_order_lines_wide",
        jsType: "number",
        fieldId: 2893,
        tableId: 325,
        baseType: "type/BigInteger"
      },
      // Display name: Order Line ID
      orderLineId: {
        type: "column",
        name: "order_line_id",
        sourceName: "sales_order_lines_wide",
        jsType: "number",
        fieldId: 2892,
        tableId: 325,
        baseType: "type/BigInteger"
      },
      // Display name: Product ID
      productId: {
        type: "column",
        name: "product_id",
        sourceName: "sales_order_lines_wide",
        jsType: "number",
        fieldId: 2895,
        tableId: 325,
        baseType: "type/BigInteger"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "sales_order_lines_wide",
        jsType: "string",
        fieldId: 2896,
        tableId: 325,
        baseType: "type/Text"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "sales_order_lines_wide",
        jsType: "number",
        fieldId: 2899,
        tableId: 325,
        baseType: "type/Integer"
      },
      // Display name: Unit Price
      unitPrice: {
        type: "column",
        name: "unit_price",
        sourceName: "sales_order_lines_wide",
        jsType: "number",
        fieldId: 2900,
        tableId: 325,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_orders_wide
  salesOrdersWide: {
    type: "table",
    id: 326,
    name: "Sales Orders Wide",
    fields: {
      // Display name: Channel Name
      // Semantic type: type/Source
      channelName: {
        type: "column",
        name: "channel_name",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2911,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Country Name
      // Semantic type: type/Country
      countryName: {
        type: "column",
        name: "country_name",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2909,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Currency Code
      // Semantic type: type/Category
      currencyCode: {
        type: "column",
        name: "currency_code",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2913,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Customer ID
      customerId: {
        type: "column",
        name: "customer_id",
        sourceName: "sales_orders_wide",
        jsType: "number",
        fieldId: 2905,
        tableId: 326,
        baseType: "type/BigInteger"
      },
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2906,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Customer Segment
      // Semantic type: type/Category
      customerSegment: {
        type: "column",
        name: "customer_segment",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2907,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Discount Amount
      // Semantic type: type/Discount
      discountAmount: {
        type: "column",
        name: "discount_amount",
        sourceName: "sales_orders_wide",
        jsType: "number",
        fieldId: 2915,
        tableId: 326,
        baseType: "type/Decimal"
      },
      // Display name: Order Date
      orderDate: {
        type: "column",
        name: "order_date",
        sourceName: "sales_orders_wide",
        jsType: "Date",
        fieldId: 2904,
        tableId: 326,
        baseType: "type/Date"
      },
      // Display name: Order ID
      orderId: {
        type: "column",
        name: "order_id",
        sourceName: "sales_orders_wide",
        jsType: "number",
        fieldId: 2903,
        tableId: 326,
        baseType: "type/BigInteger"
      },
      // Display name: Order Status
      // Semantic type: type/Category
      orderStatus: {
        type: "column",
        name: "order_status",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2912,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Region Name
      // Semantic type: type/Category
      regionName: {
        type: "column",
        name: "region_name",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2908,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Sales Rep Name
      // Semantic type: type/Category
      salesRepName: {
        type: "column",
        name: "sales_rep_name",
        sourceName: "sales_orders_wide",
        jsType: "string",
        fieldId: 2910,
        tableId: 326,
        baseType: "type/Text"
      },
      // Display name: Subtotal Amount
      subtotalAmount: {
        type: "column",
        name: "subtotal_amount",
        sourceName: "sales_orders_wide",
        jsType: "number",
        fieldId: 2914,
        tableId: 326,
        baseType: "type/Decimal"
      },
      // Display name: Tax Amount
      taxAmount: {
        type: "column",
        name: "tax_amount",
        sourceName: "sales_orders_wide",
        jsType: "number",
        fieldId: 2916,
        tableId: 326,
        baseType: "type/Decimal"
      },
      // Display name: Total Amount
      totalAmount: {
        type: "column",
        name: "total_amount",
        sourceName: "sales_orders_wide",
        jsType: "number",
        fieldId: 2917,
        tableId: 326,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_payments_wide
  salesPaymentsWide: {
    type: "table",
    id: 327,
    name: "Sales Payments Wide",
    fields: {
      // Display name: Currency Code
      currencyCode: {
        type: "column",
        name: "currency_code",
        sourceName: "sales_payments_wide",
        jsType: "string",
        fieldId: 2923,
        tableId: 327,
        baseType: "type/Text"
      },
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "sales_payments_wide",
        jsType: "string",
        fieldId: 2921,
        tableId: 327,
        baseType: "type/Text"
      },
      // Display name: Invoice Number
      invoiceNumber: {
        type: "column",
        name: "invoice_number",
        sourceName: "sales_payments_wide",
        jsType: "string",
        fieldId: 2919,
        tableId: 327,
        baseType: "type/Text"
      },
      // Display name: Payment Amount
      paymentAmount: {
        type: "column",
        name: "payment_amount",
        sourceName: "sales_payments_wide",
        jsType: "number",
        fieldId: 2924,
        tableId: 327,
        baseType: "type/Decimal"
      },
      // Display name: Payment Date
      paymentDate: {
        type: "column",
        name: "payment_date",
        sourceName: "sales_payments_wide",
        jsType: "Date",
        fieldId: 2920,
        tableId: 327,
        baseType: "type/Date"
      },
      // Display name: Payment ID
      paymentId: {
        type: "column",
        name: "payment_id",
        sourceName: "sales_payments_wide",
        jsType: "number",
        fieldId: 2918,
        tableId: 327,
        baseType: "type/BigInteger"
      },
      // Display name: Payment Method
      paymentMethod: {
        type: "column",
        name: "payment_method",
        sourceName: "sales_payments_wide",
        jsType: "string",
        fieldId: 2922,
        tableId: 327,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_price_lists_wide
  salesPriceListsWide: {
    type: "table",
    id: 328,
    name: "Sales Price Lists Wide",
    fields: {
      // Display name: Currency Code
      currencyCode: {
        type: "column",
        name: "currency_code",
        sourceName: "sales_price_lists_wide",
        jsType: "string",
        fieldId: 2927,
        tableId: 328,
        baseType: "type/Text"
      },
      // Display name: Effective Date
      effectiveDate: {
        type: "column",
        name: "effective_date",
        sourceName: "sales_price_lists_wide",
        jsType: "Date",
        fieldId: 2928,
        tableId: 328,
        baseType: "type/Date"
      },
      // Display name: Expiry Date
      expiryDate: {
        type: "column",
        name: "expiry_date",
        sourceName: "sales_price_lists_wide",
        jsType: "Date",
        fieldId: 2929,
        tableId: 328,
        baseType: "type/Date"
      },
      // Display name: List Price
      listPrice: {
        type: "column",
        name: "list_price",
        sourceName: "sales_price_lists_wide",
        jsType: "number",
        fieldId: 2930,
        tableId: 328,
        baseType: "type/Decimal"
      },
      // Display name: Price List ID
      priceListId: {
        type: "column",
        name: "price_list_id",
        sourceName: "sales_price_lists_wide",
        jsType: "number",
        fieldId: 2925,
        tableId: 328,
        baseType: "type/BigInteger"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "sales_price_lists_wide",
        jsType: "string",
        fieldId: 2926,
        tableId: 328,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_quotes_wide
  salesQuotesWide: {
    type: "table",
    id: 329,
    name: "Sales Quotes Wide",
    fields: {
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "sales_quotes_wide",
        jsType: "string",
        fieldId: 2933,
        tableId: 329,
        baseType: "type/Text"
      },
      // Display name: Expiry Date
      expiryDate: {
        type: "column",
        name: "expiry_date",
        sourceName: "sales_quotes_wide",
        jsType: "Date",
        fieldId: 2936,
        tableId: 329,
        baseType: "type/Date"
      },
      // Display name: Quote Date
      quoteDate: {
        type: "column",
        name: "quote_date",
        sourceName: "sales_quotes_wide",
        jsType: "Date",
        fieldId: 2932,
        tableId: 329,
        baseType: "type/Date"
      },
      // Display name: Quote ID
      quoteId: {
        type: "column",
        name: "quote_id",
        sourceName: "sales_quotes_wide",
        jsType: "number",
        fieldId: 2931,
        tableId: 329,
        baseType: "type/BigInteger"
      },
      // Display name: Quote Status
      quoteStatus: {
        type: "column",
        name: "quote_status",
        sourceName: "sales_quotes_wide",
        jsType: "string",
        fieldId: 2935,
        tableId: 329,
        baseType: "type/Text"
      },
      // Display name: Sales Rep Name
      salesRepName: {
        type: "column",
        name: "sales_rep_name",
        sourceName: "sales_quotes_wide",
        jsType: "string",
        fieldId: 2934,
        tableId: 329,
        baseType: "type/Text"
      },
      // Display name: Total Amount
      totalAmount: {
        type: "column",
        name: "total_amount",
        sourceName: "sales_quotes_wide",
        jsType: "number",
        fieldId: 2937,
        tableId: 329,
        baseType: "type/Decimal"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_returns_wide
  salesReturnsWide: {
    type: "table",
    id: 330,
    name: "Sales Returns Wide",
    fields: {
      // Display name: Customer Name
      customerName: {
        type: "column",
        name: "customer_name",
        sourceName: "sales_returns_wide",
        jsType: "string",
        fieldId: 2941,
        tableId: 330,
        baseType: "type/Text"
      },
      // Display name: Order ID
      orderId: {
        type: "column",
        name: "order_id",
        sourceName: "sales_returns_wide",
        jsType: "number",
        fieldId: 2939,
        tableId: 330,
        baseType: "type/BigInteger"
      },
      // Display name: Product Name
      productName: {
        type: "column",
        name: "product_name",
        sourceName: "sales_returns_wide",
        jsType: "string",
        fieldId: 2942,
        tableId: 330,
        baseType: "type/Text"
      },
      // Display name: Quantity
      quantity: {
        type: "column",
        name: "quantity",
        sourceName: "sales_returns_wide",
        jsType: "number",
        fieldId: 2944,
        tableId: 330,
        baseType: "type/Integer"
      },
      // Display name: Refund Amount
      refundAmount: {
        type: "column",
        name: "refund_amount",
        sourceName: "sales_returns_wide",
        jsType: "number",
        fieldId: 2945,
        tableId: 330,
        baseType: "type/Decimal"
      },
      // Display name: Return Date
      returnDate: {
        type: "column",
        name: "return_date",
        sourceName: "sales_returns_wide",
        jsType: "Date",
        fieldId: 2940,
        tableId: 330,
        baseType: "type/Date"
      },
      // Display name: Return ID
      returnId: {
        type: "column",
        name: "return_id",
        sourceName: "sales_returns_wide",
        jsType: "number",
        fieldId: 2938,
        tableId: 330,
        baseType: "type/BigInteger"
      },
      // Display name: Return Reason
      returnReason: {
        type: "column",
        name: "return_reason",
        sourceName: "sales_returns_wide",
        jsType: "string",
        fieldId: 2943,
        tableId: 330,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: staging
  // Table: sales_targets_wide
  salesTargetsWide: {
    type: "table",
    id: 331,
    name: "Sales Targets Wide",
    fields: {
      // Display name: Attainment Pct
      attainmentPct: {
        type: "column",
        name: "attainment_pct",
        sourceName: "sales_targets_wide",
        jsType: "number",
        fieldId: 2951,
        tableId: 331,
        baseType: "type/Decimal"
      },
      // Display name: Quota Amount
      quotaAmount: {
        type: "column",
        name: "quota_amount",
        sourceName: "sales_targets_wide",
        jsType: "number",
        fieldId: 2950,
        tableId: 331,
        baseType: "type/Decimal"
      },
      // Display name: Region Name
      regionName: {
        type: "column",
        name: "region_name",
        sourceName: "sales_targets_wide",
        jsType: "string",
        fieldId: 2948,
        tableId: 331,
        baseType: "type/Text"
      },
      // Display name: Sales Rep Name
      salesRepName: {
        type: "column",
        name: "sales_rep_name",
        sourceName: "sales_targets_wide",
        jsType: "string",
        fieldId: 2947,
        tableId: 331,
        baseType: "type/Text"
      },
      // Display name: Target Date
      targetDate: {
        type: "column",
        name: "target_date",
        sourceName: "sales_targets_wide",
        jsType: "Date",
        fieldId: 2949,
        tableId: 331,
        baseType: "type/Date"
      },
      // Display name: Target ID
      targetId: {
        type: "column",
        name: "target_id",
        sourceName: "sales_targets_wide",
        jsType: "number",
        fieldId: 2946,
        tableId: 331,
        baseType: "type/BigInteger"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: schema_migrations
  schemaMigrations: {
    type: "table",
    id: 271,
    name: "Schema Migrations",
    fields: { }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: scratch_notes
  scratchNotes: {
    type: "table",
    id: 272,
    name: "Scratch Notes",
    fields: {
      // Display name: Body
      body: {
        type: "column",
        name: "body",
        sourceName: "scratch_notes",
        jsType: "string",
        fieldId: 2277,
        tableId: 272,
        baseType: "type/Text"
      },
      // Display name: Created At
      createdAt: {
        type: "column",
        name: "created_at",
        sourceName: "scratch_notes",
        jsType: "Date",
        fieldId: 2278,
        tableId: 272,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Note ID
      noteId: {
        type: "column",
        name: "note_id",
        sourceName: "scratch_notes",
        jsType: "number",
        fieldId: 2275,
        tableId: 272,
        baseType: "type/BigInteger"
      },
      // Display name: Title
      title: {
        type: "column",
        name: "title",
        sourceName: "scratch_notes",
        jsType: "string",
        fieldId: 2276,
        tableId: 272,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: public
  // Table: tmp_export_2024
  tmpExport2024: {
    type: "table",
    id: 273,
    name: "Tmp Export 2024",
    fields: {
      // Display name: Export ID
      exportId: {
        type: "column",
        name: "export_id",
        sourceName: "tmp_export_2024",
        jsType: "number",
        fieldId: 2279,
        tableId: 273,
        baseType: "type/BigInteger"
      },
      // Display name: Export Name
      exportName: {
        type: "column",
        name: "export_name",
        sourceName: "tmp_export_2024",
        jsType: "string",
        fieldId: 2280,
        tableId: 273,
        baseType: "type/Text"
      },
      // Display name: Exported At
      exportedAt: {
        type: "column",
        name: "exported_at",
        sourceName: "tmp_export_2024",
        jsType: "Date",
        fieldId: 2281,
        tableId: 273,
        baseType: "type/DateTimeWithLocalTZ"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: v_batches
  vBatches: {
    type: "table",
    id: 333,
    name: "V Batches",
    fields: {
      // Display name: Batch ID
      batchId: {
        type: "column",
        name: "batch_id",
        sourceName: "v_batches",
        jsType: "number",
        fieldId: 2958,
        tableId: 333,
        baseType: "type/BigInteger"
      },
      // Display name: Changes
      // Semantic type: type/SerializedJSON
      changes: {
        type: "column",
        name: "changes",
        sourceName: "v_batches",
        jsType: "string",
        fieldId: 2962,
        tableId: 333,
        baseType: "type/Text"
      },
      // Display name: Error Message
      // Semantic type: type/Category
      errorMessage: {
        type: "column",
        name: "error_message",
        sourceName: "v_batches",
        jsType: "string",
        fieldId: 2961,
        tableId: 333,
        baseType: "type/Text"
      },
      // Display name: Requested At
      requestedAt: {
        type: "column",
        name: "requested_at",
        sourceName: "v_batches",
        jsType: "Date",
        fieldId: 2959,
        tableId: 333,
        baseType: "type/DateTimeWithLocalTZ"
      },
      // Display name: Results
      // Semantic type: type/SerializedJSON
      results: {
        type: "column",
        name: "results",
        sourceName: "v_batches",
        jsType: "string",
        fieldId: 2963,
        tableId: 333,
        baseType: "type/Text"
      },
      // Display name: Status
      // Semantic type: type/Category
      status: {
        type: "column",
        name: "status",
        sourceName: "v_batches",
        jsType: "string",
        fieldId: 2960,
        tableId: 333,
        baseType: "type/Text"
      }
    }
  },
  // Database: sample_dwh
  // Schema: fine_grained_access
  // Table: v_columns
  vColumns: {
    type: "table",
    id: 334,
    name: "V Columns",
    fields: {
      // Display name: Column Name
      columnName: {
        type: "column",
        name: "column_name",
        sourceName: "v_columns",
        jsType: "string",
        fieldId: 2966,
        tableId: 334,
        baseType: "type/Text"
      },
      // Display name: Data Type
      // Semantic type: type/Category
      dataType: {
        type: "column",
        name: "data_type",
        sourceName: "v_columns",
        jsType: "string",
        fieldId: 2967,
        tableId: 334,
        baseType: "type/Text"
      },
      // Display name: Ordinal
      ordinal: {
        type: "column",
        name: "ordinal",
        sourceName: "v_columns",
        jsType: "number",
        fieldId: 2969,
        tableId: 334,
        baseType: "type/Integer"
      },
      // Display name: Schema Name
      // Semantic type: type/Category
      schemaName: {
        type: "column",
        name: "schema_name",
        sourceName: "v_columns",
        jsType: "string",
        fieldId: 2964,
        tableId: 334,
        baseType: "type/Text"
      },
      // Display name: Table Name
      tableName: {
        type: "column",
        name: "table_name",
        sourceName: "v_columns",
        jsType: "string",
        fieldId: 2965,
        tableId: 334,
        baseType: "type/Text"
      },
      // Display name: Type Kind
      // Semantic type: type/Category
      typeKind: {
        type: "column",
        name: "type_kind",
        sourceName: "v_columns",
        jsType: "string",
        fieldId: 2968,
        tableId: 334,
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
  // Table: v_rls_tables
  vRlsTables: {
    type: "table",
    id: 335,
    name: "V Rls Tables",
    fields: {
      // Display name: Other Policy Count
      // Semantic type: type/Quantity
      otherPolicyCount: {
        type: "column",
        name: "other_policy_count",
        sourceName: "v_rls_tables",
        jsType: "number",
        fieldId: 2973,
        tableId: 335,
        baseType: "type/Integer"
      },
      // Display name: Policy Count
      // Semantic type: type/Quantity
      policyCount: {
        type: "column",
        name: "policy_count",
        sourceName: "v_rls_tables",
        jsType: "number",
        fieldId: 2972,
        tableId: 335,
        baseType: "type/Integer"
      },
      // Display name: Schema Name
      // Semantic type: type/Category
      schemaName: {
        type: "column",
        name: "schema_name",
        sourceName: "v_rls_tables",
        jsType: "string",
        fieldId: 2970,
        tableId: 335,
        baseType: "type/Text"
      },
      // Display name: Table Name
      // Semantic type: type/Category
      tableName: {
        type: "column",
        name: "table_name",
        sourceName: "v_rls_tables",
        jsType: "string",
        fieldId: 2971,
        tableId: 335,
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
  // Table: v_row_policies
  vRowPolicies: {
    type: "table",
    id: 336,
    name: "V Row Policies",
    fields: {
      // Display name: Definition
      definition: {
        type: "column",
        name: "definition",
        sourceName: "v_row_policies",
        jsType: "string",
        fieldId: 2982,
        tableId: 336,
        baseType: "type/Text"
      },
      // Display name: Filter Column
      filterColumn: {
        type: "column",
        name: "filter_column",
        sourceName: "v_row_policies",
        jsType: "string",
        fieldId: 2980,
        tableId: 336,
        baseType: "type/Text"
      },
      // Display name: Filter Values
      filterValues: {
        type: "column",
        name: "filter_values",
        sourceName: "v_row_policies",
        jsType: "string",
        fieldId: 2981,
        tableId: 336,
        baseType: "type/Text"
      },
      // Display name: Is Managed
      isManaged: {
        type: "column",
        name: "is_managed",
        sourceName: "v_row_policies",
        jsType: "boolean",
        fieldId: 2978,
        tableId: 336,
        baseType: "type/Boolean"
      },
      // Display name: Is Permissive
      isPermissive: {
        type: "column",
        name: "is_permissive",
        sourceName: "v_row_policies",
        jsType: "boolean",
        fieldId: 2979,
        tableId: 336,
        baseType: "type/Boolean"
      },
      // Display name: Policy Name
      policyName: {
        type: "column",
        name: "policy_name",
        sourceName: "v_row_policies",
        jsType: "string",
        fieldId: 2976,
        tableId: 336,
        baseType: "type/Text"
      },
      // Display name: Role Name
      roleName: {
        type: "column",
        name: "role_name",
        sourceName: "v_row_policies",
        jsType: "string",
        fieldId: 2977,
        tableId: 336,
        baseType: "type/Text"
      },
      // Display name: Schema Name
      schemaName: {
        type: "column",
        name: "schema_name",
        sourceName: "v_row_policies",
        jsType: "string",
        fieldId: 2974,
        tableId: 336,
        baseType: "type/Text"
      },
      // Display name: Table Name
      tableName: {
        type: "column",
        name: "table_name",
        sourceName: "v_row_policies",
        jsType: "string",
        fieldId: 2975,
        tableId: 336,
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
  generatedAt: "2026-09-25T20:26:28.594855787Z",
  metabase: {
    instanceUrl: "http://localhost:3000"
  },
  models: models,
  tables: tables,
  metrics: metrics
} as const;

export default schema;
