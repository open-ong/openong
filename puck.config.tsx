import type { Config } from '@puckeditor/core';

type Props = {
  Hero: {
    title: string;
    subtitle: string;
    align: 'left' | 'center';
  };
  Heading: {
    text: string;
    level: 'h1' | 'h2' | 'h3';
  };
  Text: {
    text: string;
    align: 'left' | 'center' | 'right';
  };
  Button: {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  };
  Image: {
    src: string;
    alt: string;
  };
  Spacer: {
    size: number;
  };
};

const alignClass = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto'
} as const;

export const config: Config<Props> = {
  root: {
    fields: {
      title: { type: 'text' }
    },
    defaultProps: {
      title: 'Page'
    },
    render: ({ children }) => <>{children}</>
  },
  components: {
    Hero: {
      label: 'Hero',
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        align: {
          type: 'radio',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' }
          ]
        }
      },
      defaultProps: {
        title: 'Welcome to our site',
        subtitle: 'A short, compelling description of what you offer.',
        align: 'center'
      },
      render: ({ title, subtitle, align }) => (
        <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-24">
          <div
            className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
          >
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
          </div>
        </section>
      )
    },
    Heading: {
      label: 'Heading',
      fields: {
        text: { type: 'text' },
        level: {
          type: 'select',
          options: [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' }
          ]
        }
      },
      defaultProps: { text: 'Heading', level: 'h2' },
      render: ({ text, level: Level }) => {
        const sizes = {
          h1: 'text-4xl',
          h2: 'text-3xl',
          h3: 'text-2xl'
        } as const;
        return (
          <div className="px-6 py-4">
            <Level className={`${sizes[Level]} font-bold text-gray-900`}>
              {text}
            </Level>
          </div>
        );
      }
    },
    Text: {
      label: 'Text',
      fields: {
        text: { type: 'textarea' },
        align: {
          type: 'radio',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        }
      },
      defaultProps: { text: 'Some paragraph text.', align: 'left' },
      render: ({ text, align }) => (
        <div className="px-6 py-4">
          <p className={`max-w-3xl text-gray-700 ${alignClass[align]}`}>
            {text}
          </p>
        </div>
      )
    },
    Button: {
      label: 'Button',
      fields: {
        label: { type: 'text' },
        href: { type: 'text' },
        variant: {
          type: 'radio',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' }
          ]
        }
      },
      defaultProps: {
        label: 'Get started',
        href: '#',
        variant: 'primary'
      },
      render: ({ label, href, variant }) => (
        <div className="px-6 py-4">
          <a
            href={href}
            className={
              variant === 'primary'
                ? 'inline-block rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700'
                : 'inline-block rounded-md border border-gray-300 px-5 py-2.5 font-medium text-gray-900 transition-colors hover:bg-gray-50'
            }
          >
            {label}
          </a>
        </div>
      )
    },
    Image: {
      label: 'Image',
      fields: {
        src: { type: 'text' },
        alt: { type: 'text' }
      },
      defaultProps: {
        src: 'https://placehold.co/800x400',
        alt: ''
      },
      render: ({ src, alt }) => (
        <div className="px-6 py-4">
          <img src={src} alt={alt} className="mx-auto rounded-lg" />
        </div>
      )
    },
    Spacer: {
      label: 'Spacer',
      fields: {
        size: { type: 'number' }
      },
      defaultProps: { size: 32 },
      render: ({ size }) => <div style={{ height: size }} />
    }
  }
};

export default config;
