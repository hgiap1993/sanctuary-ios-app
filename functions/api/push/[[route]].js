/**
 * Cloudflare Pages Function wrapper for /api/push/*
 * Automatically active when deploying the Sanctuary folder to Cloudflare Pages!
 */
import worker from "../../../cloudflare-push-worker/worker.js";

export async function onRequest(context) {
  return worker.fetch(context.request, context.env, context);
}
