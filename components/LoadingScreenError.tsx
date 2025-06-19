import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoadingScreenError({ onRetry }) {

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>We couldn't connect and download the data!</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={onRetry}>
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { textAlign: 'center', marginBottom: 12 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});