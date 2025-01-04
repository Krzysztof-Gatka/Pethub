export interface ShelterModel {
    id: number;
    name: string;
    address: string;
    description: string;
    phone: string;
    email: string;
}

export interface ShelterCardProps extends ShelterModel {
    isLoggedIn?: boolean;
    isFollowed?: boolean;
    onFollow?: (id: number) => void;
}