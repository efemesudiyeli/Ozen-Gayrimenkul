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

const contactQuery = `*[_type == "contactPage" && _id == "contactPage"][0]{
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

  const extractLocalTenDigits = (input: string) => {
    const onlyDigits = (input || '').replace(/[^0-9]/g, '')
    if (onlyDigits.length === 10) return onlyDigits
    if (onlyDigits.length === 11 && onlyDigits.startsWith('0')) return onlyDigits.slice(1)
    if (onlyDigits.length > 10) return onlyDigits.slice(-10)
    return ''
  }
  const localTenFromPrimary = extractLocalTenDigits(contactData.contactInfo.phone.number || '')
  const localTenFromDisplay = extractLocalTenDigits(contactData.contactInfo.phone.displayNumber || '')
  const chosenLocalTen = localTenFromPrimary || localTenFromDisplay
  const waPhone = chosenLocalTen ? `90${chosenLocalTen}` : ''

  return (
    <main className="bg-gray-50">
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
            {waPhone && (
              <div className="mb-4">
                <a
                  href={`https://wa.me/${waPhone}?text=Merhaba%20bilgi%20almak%20istiyorum.`}
                  className="block bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors text-center flex items-center justify-center"
                >
                  <span className="inline-flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.52 3.48A11.8 11.8 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.11 1.52 5.85L0 24l6.3-1.64A11.82 11.82 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.18-3.48-8.52zM12 22a9.93 9.93 0 01-5.08-1.39l-.36-.21-3.76.98 1-3.67-.24-.38A9.96 9.96 0 1122 12c0 5.52-4.48 10-10 10zm5.49-7.36c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.73-1.64-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.14 4.39.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.19-.57-.34z" />
                    </svg>
                    WhatsApp ile İletişime Geç
                  </span>
                </a>
              </div>
            )}
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ContactPage