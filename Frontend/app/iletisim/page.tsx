import { Metadata } from 'next'
import { client } from '@/sanity/client'
import ContactForm from '@/components/ContactForm'

interface ContactInfo {
  address: {
    title: string;
    content: string;
    icon: string;
  };
  phone: {
    title: string;
    number: string;
    displayNumber: string;
    icon: string;
  };
  email: {
    title: string;
    address: string;
    icon: string;
  };
}

interface ContactPageData {
  title: string;
  heroTitle: string;
  heroDescription: string;
  contactInfo: ContactInfo;
}

const contactQuery = `*[_type == "contactPage"][0]{
  title,
  heroTitle,
  heroDescription,
  contactInfo
}`;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const contactData = await client.fetch<ContactPageData>(contactQuery);
    return {
      title: `${contactData.title || 'İletişim'} | Hatice Özen Gayrimenkul`,
      description: contactData.heroDescription || 'Bizimle iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.',
    };
  } catch {
    return {
      title: 'İletişim | Hatice Özen Gayrimenkul',
      description: 'Bizimle iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.',
    };
  }
}

const ContactPage = async () => {
  const defaultData: ContactPageData = {
    title: 'İletişim',
    heroTitle: 'Bize Ulaşın',
    heroDescription: 'Sorularınız, talepleriniz veya randevu için bizimle iletişime geçin.',
    contactInfo: {
      address: {
        title: 'Adres',
        content: 'Güzeloba Mah. Lara Cad. No:123/A, 07230 Muratpaşa/Antalya',
        icon: '📍'
      },
      phone: {
        title: 'Telefon',
        number: '+905321202489',
        displayNumber: '+90 532 120 24 89',
        icon: '📞'
      },
      email: {
        title: 'E-posta',
        address: 'info@ozengayrimenkul.com',
        icon: '✉️'
      }
    }
  };

  let contactData = defaultData;
  
  try {
    const fetchedData = await client.fetch<ContactPageData>(contactQuery);
    if (fetchedData) {
      contactData = fetchedData;
    }
  } catch (error) {
    console.error('Contact page data fetch error:', error);
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-inter">
            {contactData.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-inter">
            {contactData.heroDescription}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Konumumuz */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Konumumuz</h2>
            <div className="w-full h-96 overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.6083630738244!2d30.643865375330254!3d36.8757920634356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39156cab78b6f%3A0xef3d5f2e46cdc856!2sHatice%20%C3%B6zen%20gayrimenkul!5e0!3m2!1str!2str!4v1757514027255!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Özen Gayrimenkul Konumu"
              />
            </div>
          </div>

          {/* İletişim Formu */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Bize Mesaj Gönderin</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage