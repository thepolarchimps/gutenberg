/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	NavigableMenu,
	MenuItem,
	FormFileUpload,
	MenuGroup,
	ToolbarGroup,
	ToolbarButton,
	Dropdown,
	SVG,
	Rect,
	Path,
	Button,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { upload, media } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

const ALLOWED_TYPES = [ 'text/vtt' ];

const DEFAULT_KIND = 'subtitles';

const KIND_OPTIONS = [
	{ label: 'Subtitles', value: 'subtitles' },
	{ label: 'Captions', value: 'captions' },
	{ label: 'Descriptions', value: 'descriptions' },
	{ label: 'Chapters', value: 'chapters' },
	{ label: 'Metadata', value: 'metadata' },
];

const captionIcon = (
	<SVG width="18" height="14" viewBox="0 0 18 14" role="img" fill="none">
		<Rect
			x="0.75"
			y="0.75"
			width="16.5"
			height="12.5"
			rx="1.25"
			stroke="black"
			strokeWidth="1.5"
			fill="none"
		/>
		<Path d="M3 7H15" stroke="black" strokeWidth="1.5" />
		<Path d="M3 10L15 10" stroke="black" strokeWidth="1.5" />
	</SVG>
);

function TrackList( { tracks, onEditPress } ) {
	let trackListContent;
	if ( tracks.length === 0 ) {
		trackListContent = (
			<p className="block-library-video-tracks-editor__tracks-informative-message">
				{ __(
					'Tracks can be subtitles, captions, chapters, or descriptions. They help make your content more accessible to a wider range of users.'
				) }
			</p>
		);
	} else {
		trackListContent = tracks.map( ( track, index ) => {
			return (
				<div
					key={ index }
					className="block-library-video-tracks-editor__track-list-track"
				>
					<span>{ track.label } </span>
					<Button isTertiary onClick={ () => onEditPress( index ) }>
						{ __( 'Edit' ) }
					</Button>
				</div>
			);
		} );
	}
	return (
		<MenuGroup
			label={ __( 'Tracks' ) }
			className="block-library-video-tracks-editor__track-list"
		>
			{ trackListContent }
		</MenuGroup>
	);
}

function SingleTrackEditor( { track, onChange, onOk, onRemove } ) {
	const { src, label, srcLang, kind = DEFAULT_KIND } = track;
	const fileName = src.substring( src.lastIndexOf( '/' ) + 1 );
	return (
		<div className="block-library-video-tracks-editor__single-track-editor">
			<span className="block-library-video-tracks-editor__single-track-editor-edit-track-label">
				{ __( 'Edit track' ) }
			</span>
			<span>
				{ __( 'File' ) }: <b>{ fileName }</b>
			</span>
			<div className="block-library-video-tracks-editor__single-track-editor-label-language">
				<TextControl
					onChange={ ( newLabel ) =>
						onChange( {
							...track,
							label: newLabel,
						} )
					}
					label={ __( 'Label' ) }
					value={ label }
					help={ __( 'Title of track' ) }
				/>
				<TextControl
					onChange={ ( newSrcLang ) =>
						onChange( {
							...track,
							srcLang: newSrcLang,
						} )
					}
					label={ __( 'Source language' ) }
					value={ srcLang }
					help={ __( 'Language tag (en, fr, etc.)' ) }
				/>
			</div>
			<SelectControl
				className="block-library-video-tracks-editor__single-track-editor-kind-select"
				options={ KIND_OPTIONS }
				value={ kind }
				label={ __( 'Kind' ) }
				onChange={ ( newKind ) => {
					if ( newKind === DEFAULT_KIND ) {
						newKind = undefined;
					}
					onChange( {
						...track,
						kind: newKind,
					} );
				} }
			/>
			<div className="block-library-video-tracks-editor__single-track-editor-buttons-container">
				<Button isPrimary onClick={ onOk }>
					{ __( 'Ok' ) }
				</Button>
				<Button isDestructive isLink onClick={ onRemove }>
					{ __( 'Remove' ) }
				</Button>
			</div>
		</div>
	);
}

export default function TracksEditor( { tracks = [], onChange } ) {
	const mediaUpload = useSelect( ( select ) => {
		return select( 'core/block-editor' ).getSettings().mediaUpload;
	}, [] );
	const [ trackBeingEdited, setTrackBeingEdited ] = useState( null );

	return (
		<Dropdown
			contentClassName="block-library-video-tracks-editor"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<ToolbarGroup>
					<ToolbarButton
						aria-expanded={ isOpen }
						aria-haspopup="true"
						onClick={ onToggle }
						icon={ captionIcon }
					/>
				</ToolbarGroup>
			) }
			renderContent={ ( {} ) => {
				if ( trackBeingEdited !== null ) {
					return (
						<SingleTrackEditor
							track={ tracks[ trackBeingEdited ] }
							onChange={ ( newTrack ) => {
								const newTracks = [ ...tracks ];
								newTracks[ trackBeingEdited ] = newTrack;
								onChange( newTracks );
							} }
							onOk={ () => setTrackBeingEdited( null ) }
							onRemove={ () => {
								onChange(
									tracks.filter(
										( _track, index ) =>
											index !== trackBeingEdited
									)
								);
								setTrackBeingEdited( null );
							} }
						/>
					);
				}
				return (
					<>
						<TrackList
							tracks={ tracks }
							onEditPress={ setTrackBeingEdited }
						/>
						<MenuGroup
							className="block-library-video-tracks-editor__add-tracks-container"
							label={ __( 'Add tracks' ) }
						>
							<NavigableMenu>
								<MediaUpload
									onSelect={ ( { url } ) => {
										const trackIndex = tracks.length;
										onChange( [ ...tracks, { src: url } ] );
										setTrackBeingEdited( trackIndex );
									} }
									allowedTypes={ ALLOWED_TYPES }
									render={ ( { open } ) => (
										<MenuItem
											icon={ media }
											onClick={ open }
										>
											{ __( 'Open Media Library' ) }
										</MenuItem>
									) }
								/>
								<MediaUploadCheck>
									<FormFileUpload
										onChange={ ( event ) => {
											const files = event.target.files;
											const trackIndex = tracks.length;
											mediaUpload( {
												allowedTypes: ALLOWED_TYPES,
												filesList: files,
												onFileChange: ( { url } ) => {
													if (
														! tracks[ trackIndex ]
													) {
														tracks[
															trackIndex
														] = {};
													}
													tracks[ trackIndex ] = {
														...tracks[ trackIndex ],
														src: url,
													};
													onChange( tracks );
													setTrackBeingEdited(
														trackIndex
													);
												},
											} );
										} }
										accept=".vtt,text/vtt"
										render={ ( { openFileDialog } ) => {
											return (
												<MenuItem
													icon={ upload }
													onClick={ () => {
														openFileDialog();
													} }
												>
													{ __( 'Upload' ) }
												</MenuItem>
											);
										} }
									/>
								</MediaUploadCheck>
							</NavigableMenu>
						</MenuGroup>
					</>
				);
			} }
		/>
	);
}
