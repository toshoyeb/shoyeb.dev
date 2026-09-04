/**
 * Cloudflare Pages Function — handles the contact form POST.
 *
 * Requires two environment variables set in the Pages project:
 *   RESEND_API_KEY  — from resend.com, with shoyeb.dev verified as a sending domain
 *   CONTACT_TO      — where enquiries land, e.g. toshoyeb@gmail.com
 *
 * Plain form POST with no client JavaScript: on success we 303 to /thanks so the
 * browser follows with a GET and the form cannot be resubmitted by refreshing.
 */

interface Context {
  request: Request;
  env: Record<string, string | undefined>;
}

const FIELDS = ["need", "project", "budget", "timeline", "name", "email"] as const;

function seeOther(request: Request, path: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: new URL(path, request.url).href },
  });
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const form = await request.formData();

  // Honeypot — bots fill this, people never see it. Pretend success.
  if (String(form.get("company") ?? "").trim() !== "") {
    return seeOther(request, "/thanks");
  }

  const values: Record<string, string> = {};
  for (const field of FIELDS) {
    const value = String(form.get(field) ?? "").trim();
    if (value === "") return seeOther(request, "/contact-error");
    values[field] = value;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return seeOther(request, "/contact-error");
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO;
  if (!apiKey || !to) {
    console.error("contact: RESEND_API_KEY or CONTACT_TO is not configured");
    return seeOther(request, "/contact-error");
  }

  const body = [
    `Need:     ${values.need}`,
    `Budget:   ${values.budget}`,
    `Timeline: ${values.timeline}`,
    "",
    values.project,
    "",
    `— ${values.name} <${values.email}>`,
  ].join("\n");

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "shoyeb.dev <hello@shoyeb.dev>",
      to: [to],
      reply_to: values.email,
      subject: `Enquiry: ${values.need} — ${values.name}`,
      text: body,
    }),
  });

  if (!sent.ok) {
    console.error("contact: resend returned", sent.status, await sent.text());
    return seeOther(request, "/contact-error");
  }

  return seeOther(request, "/thanks");
}
