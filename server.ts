// src/server.ts

import { serve } from "https://deno.land/std@0.200.0/http/server.ts";
import { router } from "./routes.ts";

console.log("Server running on http://localhost:8000");
await serve(router, { port: 8000 });
