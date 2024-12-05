export interface DataAccessInterface<T> {
	getAll?: () => Promise<T[]>;
	getById?: (id: string) => Promise<T | null>;
	create?: (data: Partial<T>) => Promise<T | null>;
	update?: (id: string, data: Partial<T>) => Promise<T | null>;
	delete?: (id: string) => Promise<void>;
	getByKey?: (key: string, value: string, single?: boolean) => Promise<T | T[] | null>;
}
