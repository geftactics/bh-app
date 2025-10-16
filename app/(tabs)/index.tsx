import { useRouter } from 'expo-router';
import { useEffect } from 'react';

/**
 * Root index screen that redirects to stages tab
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/stages');
  }, [router]);

  return null;
}
