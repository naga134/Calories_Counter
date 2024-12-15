import { useRoute } from '@react-navigation/native';

export default function Add() {
  const route = useRoute().params;

  console.log(route);
  return <></>;
}
