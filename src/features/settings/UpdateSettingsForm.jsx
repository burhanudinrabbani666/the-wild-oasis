import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useUpdateSetting } from "./useUpdateSettings";
import { useSettings } from "./useSetting";

function UpdateSettingsForm() {
  const { isPending, settings = {} } = useSettings();
  const { updateSetting, isUpdating } = useUpdateSetting();

  const {
    minBookingLength,
    maxBookingLength,
    maxGuestPerBooking,
    breakfastPrice,
  } = settings;

  if (isPending) return <Spinner />;

  function handleUpdate(event, field) {
    const { value } = event.target;

    if (!value) return;

    updateSetting({ [field]: Number(value) });
  }

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "minBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "maxBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestPerBooking}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "maxGuestPerBooking")}
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
