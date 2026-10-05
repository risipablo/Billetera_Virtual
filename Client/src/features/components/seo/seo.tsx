import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title: string;
    description: string;
    keywords?: string;
    url?: string;
    image?: string;
}

const SITE_NAME = 'Guita';
const BASE_URL = 'https://billetera-virtual-teal.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;

export const Seo = ({
    title,
    description,
    keywords,
    url,
    image = DEFAULT_IMAGE
}: SeoProps) => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};