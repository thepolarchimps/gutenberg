/**
 * External dependencies
 */
import { mapValues } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { useEntityBlockEditor } from '@wordpress/core-data';
import {
	BlockEditorProvider,
	BlockEditorKeyboardShortcuts,
	__experimentalLinkControl,
	BlockInspector,
	WritingFlow,
	ObserveTyping,
	BlockList,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import NavigateToLink from '../navigate-to-link';
import { SidebarInspectorFill } from '../sidebar';
import { useGlobalStylesContext } from '../editor/global-styles-provider';

export default function BlockEditor( { setIsInserterOpen } ) {
	const { settings, templateType, page } = useSelect(
		( select ) => {
			const { getSettings, getTemplateType, getPage } = select(
				'core/edit-site'
			);
			return {
				settings: getSettings( setIsInserterOpen ),
				templateType: getTemplateType(),
				page: getPage(),
			};
		},
		[ setIsInserterOpen ]
	);

	const { mergedStyles } = useGlobalStylesContext();
	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		templateType
	);

	const blockEditorSettings = useMemo(
		() => ( {
			...settings,
			__experimentalFeatures: mapValues(
				mergedStyles,
				( value ) => value.settings || {}
			),
		} ),
		[ settings, mergedStyles ]
	);

	const { setPage } = useDispatch( 'core/edit-site' );
	return (
		<BlockEditorProvider
			settings={ blockEditorSettings }
			value={ blocks }
			onInput={ onInput }
			onChange={ onChange }
			useSubRegistry={ false }
		>
			<BlockEditorKeyboardShortcuts />
			<__experimentalLinkControl.ViewerFill>
				{ useCallback(
					( fillProps ) => (
						<NavigateToLink
							{ ...fillProps }
							activePage={ page }
							onActivePageChange={ setPage }
						/>
					),
					[ page ]
				) }
			</__experimentalLinkControl.ViewerFill>
			<SidebarInspectorFill>
				<BlockInspector />
			</SidebarInspectorFill>
			<div className="editor-styles-wrapper edit-site-block-editor__editor-styles-wrapper">
				<WritingFlow>
					<ObserveTyping>
						<BlockList className="edit-site-block-editor__block-list" />
					</ObserveTyping>
				</WritingFlow>
			</div>
		</BlockEditorProvider>
	);
}
