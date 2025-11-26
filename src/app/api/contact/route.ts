import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name?: string;
  company?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;


  export async function POST(request: Request) {
    try {

      
      const payload = (await request.json()) as ContactPayload;
      const name = payload.name?.trim();
      const company = payload.company?.trim();
      const email = payload.email?.trim();
      const message = payload.message?.trim();

  
      if (!name || !email || !message) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }

      // Send the email
      const data = await resend.emails.send({
        // IMPORTANT: Until you verify your domain, you MUST use this specific 'from' address:
        from: 'matthewsteffan.dev <contact@matthewsteffan.dev>',

        to: ['mjsteffan99@gmail.com'], 
        
        subject: 'New Form Submission on MatthewSteffan.dev',
        
        html: `
          <div>
            <h1>New Inquiry</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Name:</strong> ${company}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
        `,
        replyTo: email, 
      });
  
      return NextResponse.json({ success: true, message:data }, { status: 200 });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }
  }
