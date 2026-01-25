type zodIss = {
  [x: string]: unknown;
  readonly input: unknown;
  readonly code: string;
  readonly maximum?: number | bigint;
  readonly expected?: string;
};

export const INPUT_REQUIRED_INVALID_ERROR = {
  error: (iss: zodIss) => (iss.input ? "Invalid input" : "Field required"),
};
