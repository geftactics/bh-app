import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

/**
 * Link component that opens external URLs in an in-app browser on native platforms
 */
export function ExternalLink({ href, ...rest }: Props) {
  const handlePress = async (event: any) => {
    if (Platform.OS !== 'web') {
      event.preventDefault();
      await openBrowserAsync(href);
    }
  };

  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={handlePress}
    />
  );
}
