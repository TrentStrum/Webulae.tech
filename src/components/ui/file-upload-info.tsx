interface FileUploadInfoProps {
	file: FileList | null | undefined;
	maxSize: number;
	acceptedTypes: string[];
}

export function FileUploadInfo({ file, maxSize, acceptedTypes }: FileUploadInfoProps): JSX.Element | null {
	if (!file?.length) return null;
	
	const selectedFile = file[0];
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const isValidSize = !selectedFile || selectedFile.size <= maxSize;
	const isValidType = !selectedFile || acceptedTypes.includes(selectedFile.type);

	return (
		<div className="space-y-2 text-sm">
			{selectedFile && (
				<>
					<p>
						File size: {formatFileSize(selectedFile.size)}
						{!isValidSize && (
							<span className="text-destructive ml-2">
								(Exceeds {formatFileSize(maxSize)} limit)
							</span>
						)}
					</p>
					<p>
						File type: {selectedFile.type}
						{!isValidType && (
							<span className="text-destructive ml-2">
								(Invalid file type)
							</span>
						)}
					</p>
				</>
			)}
			<ul className="text-muted-foreground space-y-1">
				<li>• Maximum file size: {formatFileSize(maxSize)}</li>
				<li>• Accepted formats: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}</li>
			</ul>
		</div>
	);
} 