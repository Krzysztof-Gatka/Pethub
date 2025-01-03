
interface Address {
    street: string,
    building_num: number
}

export interface ShelterProfile {
    id: number,
    shelter_id: number,
    organization_name: string,
    address: Address,
    phone_number: string,
}

