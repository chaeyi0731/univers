interface AddressSelectHandler {
  onAddressSelect: (address: { zipCode: string; roadAddress: string; detailAddress: string }) => void;
}

export default AddressSelectHandler;
