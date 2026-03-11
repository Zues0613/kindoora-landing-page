import { NextRequest, NextResponse } from "next/server"

// Using Resend Email Service (you'll need to install and configure it)
// Install: npm install resend
// Get your API key from: https://resend.com/api-keys

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, phone, message } = body

    // Validate input
    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Send confirmation email to customer
    const customerEmailResult = await resend.emails.send({
      from: "Kindoora <onboarding@resend.dev>",
      to: email,
      subject: "Thank You for Contacting Kindoora",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #3D3D3D;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #8B9E8B;
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .content {
                background-color: #FDF8F3;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .footer {
                text-align: center;
                color: #6B6B6B;
                font-size: 14px;
              }
              .tagline {
                color: #D4A574;
                font-weight: 600;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You, ${fullName}!</h1>
                <p class="tagline">Gentle Safety for Growing Homes</p>
              </div>
              
              <div class="content">
                <p>Thank you for contacting Kindoora. We have received your message and will review your inquiry shortly.</p>
                
                <h3>Your Message Details:</h3>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
                
                <p style="margin-top: 20px;">Our team will get back to you as soon as possible, typically within 24 hours. We appreciate your interest in Kindoora and look forward to helping you keep your home safe for your little ones.</p>
                
                <p style="margin-top: 20px;">Best regards,<br><strong>The Kindoora Team</strong></p>
              </div>
              
              <div class="footer">
                <p>&copy; 2026 Kindoora — Gentle Safety for Growing Homes</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    // Send notification email to admin
    const adminEmailResult = await resend.emails.send({
      from: "Kindoora <onboarding@resend.dev>",
      to: "admin@kindoora.com", // Replace with your admin email
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #3D3D3D;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #E8E0D5;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #8B9E8B;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>New Contact Form Submission</h2>
              
              <table>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <td><strong>Name</strong></td>
                  <td>${fullName}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>${email}</td>
                </tr>
                <tr>
                  <td><strong>Phone</strong></td>
                  <td>${phone}</td>
                </tr>
                <tr>
                  <td><strong>Message</strong></td>
                  <td>${message.replace(/\n/g, "<br>")}</td>
                </tr>
              </table>
              
              <p><strong>Time Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `,
    })

    if (customerEmailResult.error) {
      console.error("Customer email error:", customerEmailResult.error)
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Email sent successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
