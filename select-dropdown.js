// this function will load after document content load
window.readyState_complete = (func) => {
    const _caller = (f) => f();
    document.addEventListener('readystatechange', (e) => e.target.readyState === 'complete' ? (typeof func == 'function' ? setTimeout(() => _caller(func)) : '') : '');
}
window.selectSearchField = (selectElement) => {
    const tutorFormSelect = document.querySelectorAll(selectElement);
    if (typeof readyState_complete !== 'undefined' && readyState_complete) {
        readyState_complete(() => {


            tutorFormSelect.forEach(element => {
                if (!element.hasAttribute("noDropdown")) {

                    let initialSelectedItem = element.options[element.selectedIndex];
                    // console.log(element.options[element.selectedIndex].text);

                    element.style.display = 'none';
                    let searchInputWrap, searchInput, resultFilter, resultWrap, resultList, textToSearch, dropDown;
                    element.insertAdjacentHTML('afterend', ddMarkup(element.options));
                    searchInputWrap = element.nextElementSibling.querySelector('.tutor-input-search');
                    searchInput = searchInputWrap && searchInputWrap.querySelector('input');
                    if (element.options.length < 5) {
                        searchInputWrap.style.display = 'none';
                    }

                    dropDown = element.nextElementSibling.querySelector('.tutor-dropdown-select-options-container');
                    const selectLabel = element.nextElementSibling.querySelector('.tutor-dropdown-select-selected');
                    const selectedLabel = selectLabel && selectLabel.querySelector('.text-medium-body');
                    selectedLabel.innerText = initialSelectedItem && initialSelectedItem.text;



                    selectLabel.onclick = (e) => {
                        dd_hide_dom_click(document.querySelectorAll('.tutor-dropdown-select-options-container'));

                        e.stopPropagation();
                        dropDown.classList.toggle('is-active');
                        searchInput.focus();

                        dropDown.onclick = (e) => {
                            e.stopPropagation();

                        }

                    }

                    resultWrap = searchInputWrap.nextElementSibling;
                    resultList = resultWrap && resultWrap.querySelectorAll('.tutor-dropdown-select-option');

                    if (resultList) {
                        resultList.forEach((item) => {
                            item.onclick = (e) => {
                                let selectFieldOptions = Array.from(element.options);
                                selectFieldOptions.forEach((option, i) => {
                                    if (option.value === e.target.dataset.key) {
                                        dropDown.classList.toggle('is-active');
                                        selectedLabel.innerText = e.target.innerText;
                                        selectedLabel.dataset.value = option.value;
                                        element.value = option.value;
                                        const save_tutor_option = document.getElementById('save_tutor_option');
                                        if (save_tutor_option) {
                                            save_tutor_option.disabled = false;
                                        }
                                    }
                                });

                                var onChangeEvent = new Event('change');
                                element.dispatchEvent(onChangeEvent);
                                // jQuery(selectFieldOptions).trigger('change');
                            }
                        })
                    }

                    const countHiddenItems = (list) => {
                        let result = 0;
                        list.forEach((item) => {
                            if (item.style.display !== 'none') {
                                result += 1;
                            }
                        })
                        return result;
                    }

                    searchInput.oninput = (e) => {
                        let txtValue, noItemFound = false;
                        resultFilter = e.target.value.toUpperCase();
                        resultList.forEach((item) => {

                            textToSearch = item.querySelector(".text-regular-caption");
                            txtValue = textToSearch.textContent || textToSearch.innerText;
                            if (txtValue.toUpperCase().indexOf(resultFilter) > -1) {
                                item.style.display = ''
                                noItemFound = 'false';
                                // console.log('found');
                            } else {
                                noItemFound = 'true';
                                item.style.display = 'none';
                                // console.log('not found');
                            }

                        })

                        // console.log(countHiddenItems(resultList), noItemFound);

                        let noItemText = `
                    <div class="tutor-dropdown-select-option noItem">
                        <label>No item found</label>
                    </div>
                    `;

                        let appendNoItemText = dropDown.querySelector('.tutor-frequencies');
                        if (0 == countHiddenItems(resultList)) {


                            let hasNoItem = false;
                            appendNoItemText.querySelectorAll('.tutor-dropdown-select-option').forEach((item) => {
                                if (item.classList.contains('noItem') == true) {
                                    hasNoItem = true;
                                }
                            })
                            if (false == hasNoItem) {
                                appendNoItemText.insertAdjacentHTML("beforeend", noItemText);
                                hasNoItem = true;
                            }
                        } else {
                            if (null !== dropDown.querySelector('.noItem')) {
                                dropDown.querySelector('.noItem').remove();
                            }
                        }

                    }
                }
            });




            let otherDropDown = document.querySelectorAll('.tutor-dropdown-select-options-container');
            document.onclick = (e) => {
                dd_hide_dom_click(otherDropDown);
            }


        })
    }


    const dd_hide_dom_click = (elem) => {
        if (elem) {
            elem.forEach((elemItem) => {
                elemItem.classList.remove('is-active');
            })
        }
    }

    const ddMarkup = (options) => {

        let optionsList = '';
        Array.from(options).forEach((item) => {
            optionsList += `
            <div class="tutor-dropdown-select-option">
                <label>
                    <div class="text-regular-caption color-text-title tutor-admin-report-frequency" data-key="${item.value}">${item.text}</div>
                </label>
            </div>
            `;
        });

        let markupDD = `
        <div class="tutor-dropdown-select select-dropdown">
            <div class="tutor-dropdown-select-options-container">
                <div class="tutor-input-search">
                    <div class="tutor-input-group tutor-form-control-has-icon tutor-form-control-lg">
                        <span class="ttr-search-filled tutor-input-group-icon color-black-50"></span>
                        <input
                        type="search"
                        autofocus
                        class="tutor-search-input"
                        placeholder=" Search ... "
                        />
                    </div>
                </div>
                <div class="tutor-frequencies">
                    ${optionsList}
                </div>
            </div>
            <div class="tutor-dropdown-select-selected">
                <div class="text-medium-body color-text-primary"> Select One</div>
            </div>
        </div>
        `;
        return markupDD;
    };
}
/*                         placeholder="&#x1F50E; Search ... &#9906; ⌕"
 */
selectSearchField('.select-dd');