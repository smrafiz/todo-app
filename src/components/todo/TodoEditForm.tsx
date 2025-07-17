import React from 'react';

type TodoEditFormProps = {
	editTitle: string;
	editDatetime: string;
	onChangeTitle: (val: string) => void;
	onChangeDatetime: (val: string) => void;
	onSave: () => Promise<void>;
	onCancel: () => void;
};

export default function TodoEditForm({
	                                     editTitle,
	                                     editDatetime,
	                                     onChangeTitle,
	                                     onChangeDatetime,
	                                     onSave,
	                                     onCancel,
                                     }: TodoEditFormProps) {
	return (
		<div className="flex flex-col gap-2">
			<input
				className="border p-1 rounded"
				value={editTitle}
				onChange={(e) => onChangeTitle(e.target.value)}
			/>
			<input
				type="datetime-local"
				className="border p-1 rounded"
				value={editDatetime}
				onChange={(e) => onChangeDatetime(e.target.value)}
			/>
			<div className="flex gap-2">
				<button className="text-green-600 text-sm" onClick={onSave}>
					💾 Save
				</button>
				<button className="text-gray-500 text-sm" onClick={onCancel}>
					❌ Cancel
				</button>
			</div>
		</div>
	);
}