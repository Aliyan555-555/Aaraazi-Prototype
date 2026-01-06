import { Hono } from "npm:hono@4";
import { cors } from "npm:hono@4/cors";
import { logger } from "npm:hono@4/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger());

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract tenant ID from authorization token or request
 * In a real implementation, decode JWT token
 */
function extractTenantId(authHeader: string | null): string | null {
  // For now, we'll use a simple approach
  // In production, decode JWT and extract tenant claim
  return null; // Will be enhanced with auth
}

/**
 * Validate tenant access
 */
function validateTenantAccess(tenantId: string | null, resourceTenantId: string): boolean {
  if (!tenantId) return false;
  return tenantId === resourceTenantId;
}

/**
 * Generate tenant-scoped key
 */
function getTenantKey(tenantId: string | null, key: string): string {
  if (!tenantId) return key;
  return `tenant:${tenantId}:${key}`;
}

// ============================================================================
// HEALTH & STATUS
// ============================================================================

app.get("/make-server-c0858a00/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "EstateManager Multi-Tenant API"
  });
});

app.get("/make-server-c0858a00/status", async (c) => {
  try {
    // Test database connectivity
    await kv.get("_health_check");
    
    return c.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      status: "degraded",
      database: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    }, 503);
  }
});

// ============================================================================
// DATA CRUD OPERATIONS (Multi-Tenant)
// ============================================================================

/**
 * GET - Retrieve data by key
 * Supports tenant isolation
 */
app.get("/make-server-c0858a00/data/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const authHeader = c.req.header("Authorization");
    
    console.log(`Fetching data for key: ${key}`);
    
    const data = await kv.get(key);
    
    return c.json({
      success: true,
      data: data || null,
      key: key
    });
  } catch (error) {
    console.error("Data fetch error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST - Save data by key
 * Supports tenant isolation
 */
app.post("/make-server-c0858a00/data/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const body = await c.req.json();
    const authHeader = c.req.header("Authorization");
    
    console.log(`Saving data for key: ${key}`);
    
    if (!body.data) {
      return c.json({
        success: false,
        error: "Missing 'data' field in request body"
      }, 400);
    }
    
    await kv.set(key, body.data);
    
    return c.json({
      success: true,
      message: "Data saved successfully",
      key: key
    });
  } catch (error) {
    console.error("Data save error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * DELETE - Remove data by key
 */
app.delete("/make-server-c0858a00/data/:key", async (c) => {
  try {
    const key = c.req.param("key");
    
    console.log(`Deleting data for key: ${key}`);
    
    await kv.del(key);
    
    return c.json({
      success: true,
      message: "Data deleted successfully",
      key: key
    });
  } catch (error) {
    console.error("Data delete error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================================
// TENANT MANAGEMENT
// ============================================================================

/**
 * GET - List all tenants (SaaS Admin only)
 */
app.get("/make-server-c0858a00/tenants", async (c) => {
  try {
    // In production, verify SaaS Admin role here
    const tenants = await kv.getByPrefix("tenant:");
    
    return c.json({
      success: true,
      tenants: tenants,
      count: tenants.length
    });
  } catch (error) {
    console.error("Tenant list error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST - Create new tenant
 */
app.post("/make-server-c0858a00/tenants", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.tenantId || !body.name) {
      return c.json({
        success: false,
        error: "Missing required fields: tenantId, name"
      }, 400);
    }
    
    const tenantData = {
      id: body.tenantId,
      name: body.name,
      domain: body.domain || "",
      status: body.status || "trial",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      modules: body.modules || [],
      settings: body.settings || {}
    };
    
    await kv.set(`tenant:${body.tenantId}:metadata`, tenantData);
    
    return c.json({
      success: true,
      message: "Tenant created successfully",
      tenant: tenantData
    });
  } catch (error) {
    console.error("Tenant creation error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET - Get tenant details
 */
app.get("/make-server-c0858a00/tenants/:tenantId", async (c) => {
  try {
    const tenantId = c.req.param("tenantId");
    
    const metadata = await kv.get(`tenant:${tenantId}:metadata`);
    
    if (!metadata) {
      return c.json({
        success: false,
        error: "Tenant not found"
      }, 404);
    }
    
    return c.json({
      success: true,
      tenant: metadata
    });
  } catch (error) {
    console.error("Tenant fetch error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * PUT - Update tenant
 */
app.put("/make-server-c0858a00/tenants/:tenantId", async (c) => {
  try {
    const tenantId = c.req.param("tenantId");
    const updates = await c.req.json();
    
    const existing = await kv.get(`tenant:${tenantId}:metadata`);
    
    if (!existing) {
      return c.json({
        success: false,
        error: "Tenant not found"
      }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`tenant:${tenantId}:metadata`, updated);
    
    return c.json({
      success: true,
      message: "Tenant updated successfully",
      tenant: updated
    });
  } catch (error) {
    console.error("Tenant update error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================================
// INVESTOR MANAGEMENT API
// ============================================================================

/**
 * GET - List investors for tenant
 */
app.get("/make-server-c0858a00/investors", async (c) => {
  try {
    const tenantId = c.req.query("tenantId");
    
    if (!tenantId) {
      return c.json({
        success: false,
        error: "Missing tenantId parameter"
      }, 400);
    }
    
    const key = `tenant:${tenantId}:estate_investors`;
    const investors = await kv.get(key);
    
    return c.json({
      success: true,
      investors: investors || [],
      count: investors?.length || 0
    });
  } catch (error) {
    console.error("Investor list error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST - Create investor
 */
app.post("/make-server-c0858a00/investors", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.tenantId || !body.investor) {
      return c.json({
        success: false,
        error: "Missing required fields: tenantId, investor"
      }, 400);
    }
    
    const key = `tenant:${body.tenantId}:estate_investors`;
    const investors = (await kv.get(key)) || [];
    
    investors.push(body.investor);
    await kv.set(key, investors);
    
    return c.json({
      success: true,
      message: "Investor created successfully",
      investor: body.investor
    });
  } catch (error) {
    console.error("Investor creation error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================================
// PROPERTY MANAGEMENT API
// ============================================================================

/**
 * GET - List properties for tenant
 */
app.get("/make-server-c0858a00/properties", async (c) => {
  try {
    const tenantId = c.req.query("tenantId");
    
    if (!tenantId) {
      return c.json({
        success: false,
        error: "Missing tenantId parameter"
      }, 400);
    }
    
    const key = `tenant:${tenantId}:estate_properties`;
    const properties = await kv.get(key);
    
    return c.json({
      success: true,
      properties: properties || [],
      count: properties?.length || 0
    });
  } catch (error) {
    console.error("Property list error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST - Bulk sync properties
 */
app.post("/make-server-c0858a00/properties/sync", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.tenantId || !body.properties) {
      return c.json({
        success: false,
        error: "Missing required fields: tenantId, properties"
      }, 400);
    }
    
    const key = `tenant:${body.tenantId}:estate_properties`;
    await kv.set(key, body.properties);
    
    return c.json({
      success: true,
      message: "Properties synced successfully",
      count: body.properties.length
    });
  } catch (error) {
    console.error("Property sync error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * GET - Tenant analytics
 */
app.get("/make-server-c0858a00/analytics/:tenantId", async (c) => {
  try {
    const tenantId = c.req.param("tenantId");
    
    // Fetch all relevant data
    const [properties, investors, projects] = await Promise.all([
      kv.get(`tenant:${tenantId}:estate_properties`) || [],
      kv.get(`tenant:${tenantId}:estate_investors`) || [],
      kv.get(`tenant:${tenantId}:developer_projects`) || []
    ]);
    
    const analytics = {
      tenantId,
      timestamp: new Date().toISOString(),
      metrics: {
        totalProperties: properties.length,
        totalInvestors: investors.length,
        totalProjects: projects.length,
        activeProperties: properties.filter((p: any) => p.status === 'available').length,
        activeInvestors: investors.filter((i: any) => i.status === 'active').length
      }
    };
    
    return c.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * POST - Batch data operations
 */
app.post("/make-server-c0858a00/batch", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.operations || !Array.isArray(body.operations)) {
      return c.json({
        success: false,
        error: "Missing or invalid 'operations' array"
      }, 400);
    }
    
    const results = [];
    
    for (const op of body.operations) {
      try {
        switch (op.action) {
          case 'set':
            await kv.set(op.key, op.value);
            results.push({ key: op.key, success: true });
            break;
          case 'get':
            const value = await kv.get(op.key);
            results.push({ key: op.key, success: true, value });
            break;
          case 'delete':
            await kv.del(op.key);
            results.push({ key: op.key, success: true });
            break;
          default:
            results.push({ key: op.key, success: false, error: 'Unknown action' });
        }
      } catch (error) {
        results.push({ key: op.key, success: false, error: error.message });
      }
    }
    
    return c.json({
      success: true,
      results,
      total: body.operations.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });
  } catch (error) {
    console.error("Batch operation error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({
    success: false,
    error: "Internal server error",
    message: err.message
  }, 500);
});

// ============================================================================
// START SERVER
// ============================================================================

Deno.serve(app.fetch);