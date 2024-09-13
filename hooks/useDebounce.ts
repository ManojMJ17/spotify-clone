import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay?: number): T {
	const [debouncedValue, setDeBouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDeBouncedValue(value);
		}, delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
