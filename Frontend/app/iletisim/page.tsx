import { Metadata } from 'next'
import { client } from '@/sanity/client'

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
      title: `${contactData.title || 'İletişim'} | Özen Gayrimenkul`,
      description: contactData.heroDescription || 'Bizimle iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.',
    };
  } catch (error) {
    return {
      title: 'İletişim | Özen Gayrimenkul',
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
        number: '+905555555555',
        displayNumber: '+90 555 555 55 55',
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

        <div className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-8">
            {/* Adres */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span className="text-2xl">{contactData.contactInfo.address.icon}</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{contactData.contactInfo.address.title}</h3>
                <p className="mt-1 text-gray-600">
                  {contactData.contactInfo.address.content}
                </p>
              </div>
            </div>

            {/* Telefon */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span className="text-2xl">{contactData.contactInfo.phone.icon}</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{contactData.contactInfo.phone.title}</h3>
                <a href={`tel:${contactData.contactInfo.phone.number}`} className="mt-1 text-blue-600 hover:text-blue-800">
                  {contactData.contactInfo.phone.displayNumber}
                </a>
              </div>
            </div>

            {/* E-posta */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span className="text-2xl">{contactData.contactInfo.email.icon}</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{contactData.contactInfo.email.title}</h3>
                <a href={`mailto:${contactData.contactInfo.email.address}`} className="mt-1 text-blue-600 hover:text-blue-800">
                  {contactData.contactInfo.email.address}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage