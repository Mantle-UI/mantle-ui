import ObjectUtils from './ObjectUtils';

describe('ObjectUtils', () => {
    describe('mutateFieldData', () => {
        it.each(['__proto__.isAdmin', 'constructor.prototype.isAdmin', 'profile.prototype.isAdmin'])('does not mutate a prototype for %s', (field) => {
            const data = {};

            ObjectUtils.mutateFieldData(data, field, true);

            expect({}.isAdmin).toBeUndefined();
            expect(data).toEqual({});
        });

        it('mutates a safe nested field', () => {
            const data = {};

            ObjectUtils.mutateFieldData(data, 'profile.name', 'Mantle');

            expect(data).toEqual({ profile: { name: 'Mantle' } });
        });
    });
});
