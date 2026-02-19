export async function POST(req: Request) {
  const formData = await req.formData()

  const res = await fetch("http://localhost:8000/caption", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    return new Response("Error generating caption", { status: 500 })
  }

  const data = await res.json()

  return Response.json(data)
}
