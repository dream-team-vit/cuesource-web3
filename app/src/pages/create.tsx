import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { IconHash } from "@tabler/icons-react";
import {
  Paper,
  Textarea,
  TextInput,
  NumberInput,
  Container,
  Grid,
  MultiSelect,
  Text,
  Button,
  Group,
} from "@mantine/core";

export default function Home() {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <Container pb={"60px"}>
      <Text fz={"56px"} mb={"20px"} fw={"bold"}>
        Create Quest
      </Text>
      <TextInput
        placeholder="Summarize your issue"
        label="Issue Title"
        withAsterisk
        py={15}
      />

      <Textarea
        placeholder="Explain your issue in detail"
        label="Quest Summary"
        withAsterisk
        minRows={6}
        py={15}
      />

      <Grid columns={24} py={15}>
        <Grid.Col span="content">Stake Price</Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            defaultValue={70}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `eth ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "eth "
            }
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            defaultValue={70}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `eth ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "eth "
            }
          />
        </Grid.Col>
      </Grid>
      <Grid py={15}>
        <Grid.Col span="content">Set Deadline</Grid.Col>
        <Grid.Col span={4}>
          <DateInput
            value={value}
            onChange={setValue}
            placeholder="Last day to submit the solution"
            maw={400}
            mx="auto"
          />
        </Grid.Col>
      </Grid>

      <Grid py={15}>
        <Grid.Col span="content">Repo Link</Grid.Col>
        <Grid.Col span={4}>
          <TextInput placeholder="Link to your repository" withAsterisk />
        </Grid.Col>
      </Grid>

      <Group position="right" py={15}>
        <Button>Save</Button>
        <Button>Create</Button>
      </Group>
    </Container>
  );
}
