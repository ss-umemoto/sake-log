import { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Card,
  Rating,
  SakeCard,
  Screen,
  Stack,
  Text,
} from '../components';
import { useTheme } from '../theme/ThemeProvider';

export function ShowcaseScreen() {
  const theme = useTheme();
  const [rating, setRating] = useState(4);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingVertical: theme.spacing['2xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <Stack gap="2xl">
          <Section title="評価">
            <Card variant="outlined">
              <Stack gap="sm" align="flex-start">
                <Rating value={rating} onChange={setRating} size={28} />
                <Text variant="bodyMd" color="secondary">
                  評価: {rating} / 5
                </Text>
              </Stack>
            </Card>
          </Section>

          <Section title="日本酒カード">
            <Stack gap="md">
              <SakeCard
                name="獺祭 純米大吟醸 磨き二割三分"
                brewery="旭酒造"
                region="山口県"
                rating={5}
                onPress={() => {}}
              />
              <SakeCard
                name="十四代 本丸"
                brewery="高木酒造"
                region="山形県"
                rating={5}
                onPress={() => {}}
              />
              <SakeCard
                name="風の森 秋津穂 657"
                brewery="油長酒造"
                region="奈良県"
                rating={4}
                onPress={() => {}}
              />
            </Stack>
          </Section>
        </Stack>
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="md">
      <Text variant="titleLg">{title}</Text>
      {children}
    </Stack>
  );
}
